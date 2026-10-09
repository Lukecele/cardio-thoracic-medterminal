import subprocess
import os

TRACK_CONFIGS = {
    "normal.mp3": (
        "compand=attacks=0.01:decays=0.1:points=-60/-42|-30/-16|-16/-8|0/-1:soft-knee=0.05,"
        "equalizer=f=100:t=q:w=1.2:g=4,equalizer=f=250:t=q:w=1.5:g=3,alimiter=limit=0.95"
    ),
    "lateas.mp3": (
        # Aortic stenosis: boost crescendo-decrescendo mid-frequency harsh diamond murmur
        "compand=attacks=0.008:decays=0.08:points=-60/-38|-28/-12|-12/-5|0/-1:soft-knee=0.05,"
        "equalizer=f=360:t=q:w=1.0:g=9,equalizer=f=700:t=q:w=1.2:g=6,alimiter=limit=0.95"
    ),
    "mr.mp3": (
        # Mitral regurgitation: boost holosystolic blowing murmur spanning S1 to S2
        "compand=attacks=0.008:decays=0.08:points=-60/-36|-26/-10|-10/-4|0/-1:soft-knee=0.05,"
        "equalizer=f=420:t=q:w=1.0:g=10,equalizer=f=1100:t=q:w=1.4:g=6,alimiter=limit=0.95"
    ),
    "ms.mp3": (
        # Mitral stenosis: boost opening snap and diastolic rumble
        "compand=attacks=0.008:decays=0.08:points=-60/-36|-26/-10|-10/-4|0/-1:soft-knee=0.05,"
        "equalizer=f=120:t=q:w=0.9:g=8,equalizer=f=320:t=q:w=1.1:g=9,equalizer=f=600:t=q:w=1.2:g=5,alimiter=limit=0.95"
    ),
    "ar.mp3": (
        # Aortic regurgitation: boost early diastolic decrescendo blowing murmur
        "compand=attacks=0.008:decays=0.08:points=-60/-38|-28/-12|-12/-5|0/-1:soft-knee=0.05,"
        "equalizer=f=480:t=q:w=1.0:g=8,equalizer=f=1300:t=q:w=1.4:g=6,alimiter=limit=0.95"
    ),
    "s31.mp3": (
        # S3 Gallop: boost dull early diastolic thud and harmonic audible on laptop speakers
        "compand=attacks=0.008:decays=0.08:points=-60/-36|-24/-9|-9/-3|0/-1:soft-knee=0.05,"
        "equalizer=f=80:t=q:w=0.8:g=10,equalizer=f=150:t=q:w=1.0:g=8,equalizer=f=280:t=q:w=1.2:g=5,alimiter=limit=0.95"
    ),
    "s41.mp3": (
        # S4 Gallop: boost presystolic atrial kick sound and harmonics
        "compand=attacks=0.008:decays=0.08:points=-60/-36|-24/-9|-9/-3|0/-1:soft-knee=0.05,"
        "equalizer=f=80:t=q:w=0.8:g=10,equalizer=f=150:t=q:w=1.0:g=8,equalizer=f=280:t=q:w=1.2:g=5,alimiter=limit=0.95"
    ),
    "rub.mp3": (
        # Pericardial rub: boost scratchy leathery friction sounds
        "compand=attacks=0.008:decays=0.08:points=-60/-38|-28/-12|-12/-5|0/-1:soft-knee=0.05,"
        "equalizer=f=550:t=q:w=1.0:g=7,equalizer=f=1400:t=q:w=1.3:g=6,alimiter=limit=0.95"
    ),
    "crackles.mp3": (
        # Crackles: boost crisp Velcro popping sounds
        "compand=attacks=0.008:decays=0.08:points=-60/-38|-28/-12|-12/-5|0/-1:soft-knee=0.05,"
        "equalizer=f=750:t=q:w=1.0:g=7,equalizer=f=1800:t=q:w=1.3:g=6,alimiter=limit=0.95"
    ),
    "wheeze.mp3": (
        # Wheeze: boost high-pitched musical whistling
        "compand=attacks=0.008:decays=0.08:points=-60/-38|-28/-12|-12/-5|0/-1:soft-knee=0.05,"
        "equalizer=f=520:t=q:w=1.0:g=6,equalizer=f=1100:t=q:w=1.2:g=6,alimiter=limit=0.95"
    ),
    "b_breath.mp3": (
        # Bronchial breath: boost tubular resonance
        "compand=attacks=0.008:decays=0.08:points=-60/-38|-28/-12|-12/-5|0/-1:soft-knee=0.05,"
        "equalizer=f=450:t=q:w=1.0:g=7,equalizer=f=1200:t=q:w=1.3:g=6,alimiter=limit=0.95"
    ),
}

for filename, filter_chain in TRACK_CONFIGS.items():
    src = os.path.join("public/audio/original_backup", filename)
    dst = os.path.join("public/audio", filename)
    temp_dst = os.path.join("public/audio", "temp_" + filename)
    
    if not os.path.exists(src):
        print(f"Skipping {filename}: not in backup")
        continue

    cmd = [
        "ffmpeg", "-y", "-i", src,
        "-af", filter_chain,
        "-c:a", "libmp3lame", "-b:a", "192k",
        temp_dst
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        print(f"ERROR on {filename}:", res.stderr)
    else:
        os.replace(temp_dst, dst)
        print(f"SUCCESS: Remastered {filename}")
