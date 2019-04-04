# AffectiveSamplerJS
A Javascript library to record people's affective reactions to audio/video sequences.

You can preview it on CodePen here:


## Using AffectiveSamplerJS in Qualtrics

### Setup

1. Navigate to the "Look and Feel" section of your survey, and click on the "Advanced" tab
2. Edit the "Header" section, and add the following lines to load the library script:
```html
<script src="https://cdn.jsdelivr.net/gh/QuentinAndre/WordSearchJS/lib/wordsearch.min.js"></script>
```
3. Create a "Text" question, and add the following HTML code:
```html
<div id="mysamplingtask"></div>
```

4. Edit the "Custom JS" of the question, and add the following Javascript code in the `Qualtrics.SurveyEngine.addOnReady` section:
```javascript
const aff_sampler = new AffectiveSampler({
    parentId: "mysamplingtask",
    mediaUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // The media to show.
    mediaType: "video", // The type of the media, can be "video" or "audio"
    showMediaControls: false, // Whether the show the media controls. If false, only a play/pause button will be displayed.
    sliderMin: -50, // The minimum value of the affective slider
    sliderMax: 50, // The maximum value of the affective slider
    timeResolution: 1, // The time resolution (in seconds) at which to sample. Should not be lower than 1.
    textLabel: "Your current happiness rating is: ", // The label to display next to the current affective rating.
    minLabel: "Sad", // The left anchor of the affective scale.
    maxLabel: "Happy", // The right anchor of the affective scale.
    onInterval: function () {console.log("The interval has ticked")}, // A function to call when recording a value.
    onMediaEnd: function () {console.log("The media has ended")} // A function to call when the media ends.
});
```

That's it! You have added a word search task to Qualtrics!

### Accessing and storing participants' ratings

AffectiveSampler records, at a regular interval, the rating of the media. The ratings are stored in a javascript object, 
where the key is the timestamp (in seconds) and the value is the rating at this timestamp. If, for instance, the media 
is four seconds long, the ratings might look like this:

```javascript
const ratings = {
    1: 35, // At 1 second, the rating was 35.
    2: 41, // At 2 seconds, the rating was 41
    3: 12, // At 3 seconds, the rating was 12
    4: 56  // At 4 seconds, the rating was 56
}
```

Those ratings can be accessed using two convenient methods:
* `expSampler.getRatingsAsJSON()` returns the javascript object of the ratings. This method is useful when you want
to use the data in javascript.
* `ExperienceSampler.getRatingsAsString()` returns the stringified javascript object of the ratings. This method is 
useful when you want to store the data in Qualtrics.

Combined with the `onMediaEnd` argument, you can use those methods to store the ratings in Qualtrics when the task is
complete:

```javascript
function storeRatingsInQualtrics() {
    const ratings = this.getRatingsAsString();
    Qualtrics.SurveyEngine.setEmbeddedData("ratings", ratings) // Store the data in an embedded data field called "ratings"
}

const aff_sampler = new AffectiveSampler({
    parentId: "mysamplingtask",
    mediaUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // The media to show.
    mediaType: "video", // The type of the media, can be "video" or "audio"
    showMediaControls: false, // Whether the show the media controls. If false, only a play/pause button will be displayed.
    sliderMin: -50, // The minimum value of the affective slider
    sliderMax: 50, // The maximum value of the affective slider
    timeResolution: 1, // The time resolution (in seconds) at which to sample. Should not be lower than 1.
    textLabel: "Your current happiness rating is: ", // The label to display next to the current affective rating.
    minLabel: "Sad", // The left anchor of the affective scale.
    maxLabel: "Happy", // The right anchor of the affective scale.
    onInterval: function () {console.log("The interval has ticked")}, // A function to call when recording a value.
    onMediaEnd: storeRatingsInQualtrics // No parenthesis! This function will be called when the task ends.
});
```

## Version history

### v0.5.0
* First release of the library.
