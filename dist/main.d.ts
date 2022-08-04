import { EventEmitter } from 'eventemitter3';

declare class ImageStore {
    private static _instance;
    private cacheImages;
    static getInstance(): ImageStore;
    static clear(): void;
    addNode({ data, url }: {
        data: string;
        url: string;
    }): void;
    removeNode(url: string): void;
    getImage(key: string): string;
}

declare class WorkerManager extends EventEmitter {
    private store;
    Events: {
        preLoadImage: string;
        loadImage: string;
        loadImageSuccess: string;
        loadImageError: string;
    };
    private static _instance;
    private _workerImage_;
    private cbImg;
    static getInstance(): WorkerManager;
    static clear(): void;
    constructor();
    private _init;
    getObjectURL(): string;
    getStoreCache(): ImageStore | undefined;
    private addEventListenerWorker;
    loadImage(url: string): void;
    preloadImages(urls: string[]): void;
    private destroy;
}
export { WorkerManager }
export default WorkerManager;

export { }
