import "./affectivesampler.css"
import * as jQuery from 'jquery'

const $j = jQuery.noConflict();


function normalizeValue(val: number, min: number, max: number): number {
    const norm_perc = Math.min(100, Math.max(0, val)) / 100;
    const range = max - min;
    return min + Math.round(range * norm_perc)
}

interface RatingSliderConfig {
    min: number
    max: number
    minLabel: string
    maxLabel: string
    textLabel: string
    parentRef: HTMLElement
    mediaRef: HTMLElement
}

class RatingSlider {
    min: number;
    max: number;
    value: number;
    parent: HTMLElement;
    slider: HTMLInputElement;
    label: HTMLElement;
    wrapper: HTMLElement;
    textLabel: string;

    constructor(o: RatingSliderConfig) {
        this.parent = o.parentRef;
        this.textLabel = o.textLabel;
        this.onMouseMove = this.onMouseMove.bind(this);

        this.wrapper = document.createElement("div");
        this.wrapper.setAttribute('class', 'rating-slider-wrapper');
        this.wrapper.addEventListener("mousemove", this.onMouseMove);

        const label = document.createElement("div");
        label.className = "rating-label";
        this.label = label;

        const slider = document.createElement("input");
        const attrs = {
            class: "rating-slider",
            type: 'range',
            min: o.min.toString(),
            max: o.max.toString(),
            value: ((o.max + o.min) / 2).toString()
        };
        for (const [k, v] of Object.entries(attrs)) {
            slider.setAttribute(k, v)
        }
        this.min = o.min;
        this.max = o.max;
        this.value = ((o.max + o.min) / 2);
        this.label.textContent = this.textLabel + " " + this.value.toFixed(0);
        this.slider = slider;
        this.wrapper.append(label);


        const minSpan = document.createElement("div");
        minSpan.textContent = o.minLabel;
        minSpan.className = "min-label";

        const maxSpan = document.createElement("div");
        maxSpan.textContent = o.maxLabel;
        maxSpan.className = "max-label";

        this.wrapper.append(minSpan);
        this.wrapper.append(slider);
        this.wrapper.append(maxSpan);
    }

    onMouseMove(e: MouseEvent) {
        const slider = this.slider;
        const left = e.pageX - $j(slider).offset().left;
        const xperc = left / slider.clientWidth * 100;
        this.value = normalizeValue(xperc, this.min, this.max);
        slider.value = this.value.toString();
        this.label.textContent = this.textLabel + " " + this.value.toFixed(0);
    }
}

interface MediaViewerConfig {
    url: string
    type: string
    showControls: boolean
    canPause: boolean
}


class MediaViewer {
    url: string;
    type: string;
    wrapper: HTMLElement;
    media: HTMLVideoElement | HTMLAudioElement;

    constructor(o: MediaViewerConfig) {
        this.wrapper = document.createElement("div");
        this.wrapper.setAttribute("class", 'media-viewer-wrapper');
        this.media = o.type == "video" ? document.createElement("video") : document.createElement("audio");
        this.media.src = o.url;
        this.media.className = "media-viewer-media";
        this.wrapper.append(this.media);
        if (o.showControls) {
            this.media.setAttribute("controls", "controls");
        } else {
            const button = document.createElement("button");
            button.textContent = "Start the Media";
            if (o.canPause) {
                button.addEventListener("click", () => {
                    this.media.paused ? this.media.play() : this.media.pause();
                    this.media.paused ? button.textContent = "Unpause the Media" : button.textContent = "Pause the Media";

                });
            } else {
                button.addEventListener("click", () => {
                    this.media.play();
                    button.disabled = true;
                    button.textContent = "Media has started!"

                });
            }
            this.wrapper.append(button);
        }
    }
}

interface AffectiveSamplerConfig {
    parentId: string
    mediaType: string
    mediaUrl: string
    showMediaControls: boolean
    canPauseMedia: boolean
    sliderMin: number
    sliderMax: number
    timeResolution: number
    textLabel: string
    minLabel: string
    maxLabel: string
    onInterval: Function
    onMediaEnd: Function
}

class AffectiveSampler {
    url: string;
    parent: HTMLElement;
    mediaViewer: MediaViewer;
    ratingSlider: RatingSlider;
    ratings: Object;
    onInterval: Function;
    onMediaEnd: Function;
    interval: number;

    constructor(o: AffectiveSamplerConfig) {
        this.ratings = {};
        this.onInterval = o.onInterval.bind(this);
        this.onMediaEnd = o.onMediaEnd.bind(this);
        this.parent = document.getElementById(o.parentId);
        this.parent.classList.add("exp-sampler-wrapper");
        this.mediaViewer = new MediaViewer({
            url: o.mediaUrl,
            type: o.mediaType,
            showControls: o.showMediaControls,
            canPause: o.canPauseMedia
        });
        this.parent.append(this.mediaViewer.wrapper);
        this.ratingSlider = new RatingSlider({
            min: o.sliderMin,
            max: o.sliderMax,
            parentRef: this.parent,
            mediaRef: this.mediaViewer.wrapper,
            minLabel: o.minLabel,
            maxLabel: o.maxLabel,
            textLabel: o.textLabel
        });
        this.parent.append(this.ratingSlider.wrapper);
        const media = this.mediaViewer.media;
        const slider = this.ratingSlider.slider;

        media.addEventListener("play", () => {
            this.interval = window.setInterval(() => {
                let timing = media.currentTime.toFixed(0);
                this.ratings[timing] = slider.value.toString();
                this.onInterval();
            }, o.timeResolution * 1000)
        });

        media.addEventListener("pause", () => {
            window.clearInterval(this.interval)
        });

        media.addEventListener("ended", () => {
            window.clearInterval(this.interval);
            this.onMediaEnd()
        })
    }

    getRatingsAsJSON() {
        return this.ratings
    }

    getRatingsAsString() {
        return JSON.stringify(this.ratings)
    }
}

export default AffectiveSampler;