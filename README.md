# @react4tv/react-tv-fast-image



React4 SmartTV library best performant React image component, includes many utilities



Most of the browser's Image, <img/> element handles image caching by default. Even a lot of people have noticed:

- Caching is not controlled.
- Show partial images.
- Low performance when loading many images.
- Affects the main thread.
- Loading 1 image queue if it fails, it will lead to the error of the rest of the images

`SmartTVImage` is an `Image` replacement that solves these issues. `SmartTVImage` using `WebWorker` 

## Features

-  [x] Using worker.
-  [x] Manager cache images.
-  [x] Preload images.
-  [x] Placeholder.

## Installation

Using npm:

```
npm install --save @react4tv/react-tv-fast-image
```

or using yarn:

```
yarn add @react4tv/react-tv-fast-image
```
