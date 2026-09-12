export const playVideo = async (video: HTMLVideoElement): Promise<void> => {
    try {
        await video.play();
    } catch {
        // Autoplay may be blocked by the browser; the stream is still attached to the video element.
    }
};
