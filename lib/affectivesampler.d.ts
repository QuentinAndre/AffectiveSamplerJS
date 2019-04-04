import "./affectivesampler.css";
interface RatingSliderConfig {
    min: number;
    max: number;
    minLabel: string;
    maxLabel: string;
    textLabel: string;
    parentRef: HTMLElement;
    mediaRef: HTMLElement;
}
declare class RatingSlider {
    min: number;
    max: number;
    value: number;
    parent: HTMLElement;
    slider: HTMLInputElement;
    label: HTMLElement;
    wrapper: HTMLElement;
    textLabel: string;
    constructor(o: RatingSliderConfig);
    onMouseMove(e: MouseEvent): void;
}
interface MediaViewerConfig {
    url: string;
    type: string;
    showControls: boolean;
    canPause: boolean;
}
declare class MediaViewer {
    url: string;
    type: string;
    wrapper: HTMLElement;
    media: HTMLVideoElement | HTMLAudioElement;
    constructor(o: MediaViewerConfig);
}
interface AffectiveSamplerConfig {
    parentId: string;
    mediaType: string;
    mediaUrl: string;
    showMediaControls: boolean;
    canPauseMedia: boolean;
    sliderMin: number;
    sliderMax: number;
    timeResolution: number;
    textLabel: string;
    minLabel: string;
    maxLabel: string;
    onInterval: Function;
    onMediaEnd: Function;
}
declare class AffectiveSampler {
    url: string;
    parent: HTMLElement;
    mediaViewer: MediaViewer;
    ratingSlider: RatingSlider;
    ratings: Object;
    onInterval: Function;
    onMediaEnd: Function;
    interval: number;
    constructor(o: AffectiveSamplerConfig);
    getRatingsAsJSON(): Object;
    getRatingsAsString(): string;
}
export default AffectiveSampler;
