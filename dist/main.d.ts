import { EventEmitter } from 'eventemitter3';
import { default as React_2 } from 'react';
import { SafeComponent } from '@react4tv/react-safe-component';

declare const _default: {
    WorkerManager: typeof WorkerManager;
    ProgressiveImage: typeof ProgressiveImage;
};
export default _default;

declare interface IImageManager {
    loadImage: (source: ImageURISource) => void;
    preload: (sources: ImageURISource[]) => void;
    clearCache: () => void;
    getObjectURL: () => string;
}

declare type ImageURISource = {
    uri: string;
    headers?: {
        [key: string]: string;
    };
    method?: string;
};

declare interface IProp {
    children: (src: string, loading: boolean, srcSetData?: SrcSetData, usePlaceholder?: boolean) => React_2.ReactNode;
    delay?: number;
    onError?: (errorEvent: Event | string) => void;
    placeholder: string;
    src: string;
    srcSetData?: SrcSetData;
    noLazyLoad?: boolean;
    rootMargin?: string;
    threshold?: any[];
    useBlob?: boolean;
}

declare interface IState {
    image: string;
    loading?: boolean;
    srcSetData?: SrcSetData;
    isOnline?: boolean;
    usePlaceholderView?: boolean;
}

declare class ProgressiveImage extends SafeComponent<IProp, IState> {
    image: HTMLImageElement | undefined;
    timeout: any;
    static defaultProps: {
        useBlob: boolean;
    };
    constructor(props: IProp | Readonly<IProp>);
    loadSuccess: (data: any) => void;
    loadFail: (data: any) => void;
    handleOnlineStatus: () => void;
    _componentDidMount(): void;
    componentDidUpdate(prevProps: IProp): void;
    _componentWillUnmount(): void;
    loadImage: (src1: string, srcSetData?: SrcSetData | undefined) => void;
    onLoad: () => void;
    setImageWithDelay: () => void;
    setImage: () => void;
    onError: (errorEvent: Event | string) => void;
    handleIntersection: (event: IntersectionObserverEntry, unobserve: Function, isOnline?: boolean | undefined) => void;
    renderContent(): React_2.ReactNode;
}

declare interface SrcSetData {
    srcSet: string;
    sizes: string;
}

declare class WorkerManager extends EventEmitter implements IImageManager {
    private store;
    Events: {
        preLoadImage: string;
        loadImage: string;
        loadImageSuccess: string;
        loadImageError: string;
    };
    private static _instance;
    private _workerImage_;
    private listenerEvents;
    static getInstance(): WorkerManager;
    static clear(): void;
    constructor();
    loadImage(source: ImageURISource): void;
    preload(sources: ImageURISource[]): void;
    clearCache(): void;
    getObjectURL(): string;
    private _init;
    private addEventListenerWorker;
    private destroy;
}

export { }
