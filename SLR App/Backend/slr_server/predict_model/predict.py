import cv2
import numpy as np
import os
import mediapipe as mp
from tensorflow.keras.models import load_model
from Sign_Language_Recognition_Backend_Server.settings import BASE_DIR, STATIC_URL


mp_holistic = mp.solutions.holistic  # Holistic model
SEQUENCE_LENGTH = 30

# Actions that we try to detect
actions = np.array(
    ["Hello", "I", "You", "Thankyou", "Please", "Good Morning", "White", "Black", "Dog", "Cat", "Teacher", "Student",
     "Camera", "Television"])

# Videos are going to be 30 frames in length
sequence_length = 30
model_path = r"E:\Sign_Language_Recognition\Sign_Language_Recognition_Backend_Server\static\model_80_All.h5"
model = load_model(model_path)


def mediapipe_detection(image, model):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # COLOR CONVERSION BGR 2 RGB
    image.flags.writeable = False  # Image is no longer writeable
    results = model.process(image)  # Make prediction
    image.flags.writeable = True  # Image is now writeable
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)  # COLOR CONVERSION RGB 2 BGR
    return image, results


def extract_keypoints(results):
    pose = np.array([[res.x, res.y, res.z, res.visibility] for res in
                     results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(33 * 4)
    face = np.array([[res.x, res.y, res.z] for res in
                     results.face_landmarks.landmark]).flatten() if results.face_landmarks else np.zeros(468 * 3)
    lh = np.array([[res.x, res.y, res.z] for res in
                   results.left_hand_landmarks.landmark]).flatten() if results.left_hand_landmarks else np.zeros(21 * 3)
    rh = np.array([[res.x, res.y, res.z] for res in
                   results.right_hand_landmarks.landmark]).flatten() if results.right_hand_landmarks else np.zeros(
        21 * 3)
    return np.concatenate([pose, face, lh, rh])


def predict(video_capture):
    sequence = []
    word = " "
    IMAGE_HEIGHT, IMAGE_WIDTH = 480, 640
    with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
        video_frames_count = int(video_capture.get(cv2.CAP_PROP_FRAME_COUNT))
        # skip_frames_window = max(int(video_frames_count / SEQUENCE_LENGTH), 1)
        for frame_num in range(sequence_length):
            # video_capture.set(cv2.CAP_PROP_POS_FRAMES, frame_num * skip_frames_window)
            ret, frame = video_capture.read()
            if not ret:
                break

            original_height, original_width = frame.shape[:2]

            if original_width > original_height:
                new_width = int((original_height * 4) / 3)
                gap = int((original_width - new_width) / 2)
                frame = frame[:, gap:new_width + gap, :]
            elif original_width < original_height or original_width==original_height :
                new_height = int((original_width * 3) / 4)
                gap = int((original_height - new_height) / 2)
                frame = frame[:new_height, :, :]
            frame = cv2.resize(frame, (IMAGE_WIDTH, IMAGE_HEIGHT))

            image, results = mediapipe_detection(frame, holistic)
            keypoints = extract_keypoints(results)
            sequence.append(keypoints)
        res = model.predict(np.expand_dims(sequence, axis=0))[0]
        word = actions[np.argmax(res)]
        print(word)
    return word
