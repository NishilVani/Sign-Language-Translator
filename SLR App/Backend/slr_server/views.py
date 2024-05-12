import os.path
from rest_framework.decorators import api_view
from django.http import HttpResponse
from django.shortcuts import render
from Sign_Language_Recognition_Backend_Server.settings import BASE_DIR
from slr_server.predict_model import predict

from django.views.decorators import gzip
from django.http import StreamingHttpResponse
import cv2
import threading


class VideoCamera(object):
    def __init__(self):
        self.video = cv2.VideoCapture(0)
        (self.grabbed, self.frame) = self.video.read()
        threading.Thread(target=self.update, args=()).start()

    def __del__(self):
        self.video.release()

    def get_frame(self):
        image = self.frame
        _, jpeg = cv2.imencode('.jpg', image)
        return jpeg.tobytes()

    def update(self):
        while True:
            (self.grabbed, self.frame) = self.video.read()


def gen(camera):
    while True:
        frame = camera.get_frame()
        yield(b'--frame\r\n'
              b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')


@gzip.gzip_page
def translate_camera(request):
    try:
        cam = VideoCamera()
        return StreamingHttpResponse(gen(cam), content_type="multipart/x-mixed-replace;boundary=frame")
    except:  # This is bad! replace it with proper handling
        pass


# def translate_camera(request):
#     resp = StreamingHttpResponse(capture_video_from_cam())
#     return render(request, 'camera.html', {'video': resp})


# Create your views here.
@api_view(['POST'])
def translate_video(request):
    uploaded_file = request.FILES.get("file")
    if uploaded_file:
        # Read the video file into memory
        file_name = uploaded_file.name

        # Specify the file path where you want to save the uploaded video
        file_path = os.path.join(BASE_DIR, f"media\\{file_name}")

        # Open a new file in write-binary mode and save the uploaded content
        with open(file_path, "wb") as destination_file:
            for chunk in uploaded_file.chunks():
                destination_file.write(chunk)

        # Decode the video frames using OpenCV
        video_capture = cv2.VideoCapture(file_path)
        video_frames_count = int(video_capture.get(cv2.CAP_PROP_FRAME_COUNT))
        if video_frames_count < 30:
            return HttpResponse("Re Upload the File", status=204)
        word = predict.predict(video_capture)
        video_capture.release()
        os.remove(file_path)
        return HttpResponse(word)
    else:
        return HttpResponse("No file uploaded", status=204)

