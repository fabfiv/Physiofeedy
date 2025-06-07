import os
import glob



frame_folder = "Backend/frames"
old_frames = glob.glob(os.path.join(frame_folder, "frame_*.jpg"))

for frame in old_frames:
    os.remove(frame)
    print(f"Deleted old frame: {frame}")