/**
 * @module Utils
 * @description General utility functions for the library.
 */

import { Object3D, Mesh, Texture, TextureLoader, Matrix4, Frustum, Camera, WebGLRenderer, PerspectiveCamera } from "three";

/**
 * Interpolates a template string with data.
 * Replaces occurrences of `{key}` with values from `data`.
 * @param template The template string.
 * @param data The data object.
 * @returns The interpolated string.
 * @throws Will throw an error if a key is missing in data.
 * @category Utils
 */
export function interpolate(template: string, data: Record<string, any>): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            return value !== undefined ? String(value) : match;
        }
        throw new Error(`Missing required parameter for template interpolation: "${key}"`);
    });
}

/**
 * Returns the current timestamp.
 * @returns Current time in milliseconds.
 * @category Utils
 */
export function now(): number {
    return Date.now();
}

/**
 * Merges properties from source objects into the destination object.
 * @param target The target object.
 * @param sources The source objects.
 * @returns The modified target object.
 * @category Utils
 */
export function assign<T extends object>(target: T, ...sources: any[]): any {
    return Object.assign(target, ...sources);
}

/**
 * Checks if a value is null or undefined.
 * @param value The value to check.
 * @returns True if null or undefined, false otherwise.
 * @category Utils
 */
export function isNullOrUndefined(value: any): value is null | undefined {
    return value == null;
}

/**
 * Checks if a value is a valid number (typeof number and not NaN).
 * @param value The value to check.
 * @returns True if it is a valid number.
 * @category Utils
 */
export function isValidNumber(value: any): value is number {
    return typeof value === 'number' && !Number.isNaN(value);
}

/**
 * Waits for a condition to be true.
 * @param conditionFn A function that returns true when the condition is met.
 * @param intervalMs Check interval in milliseconds.
 * @returns A promise that resolves when the condition is met.
 * @category Utils
 */
export function waitUntil(conditionFn: () => boolean, intervalMs = 100): Promise<void> {
    return new Promise<void>(resolve => {
        const check = () => {
            if (conditionFn()) {
                resolve();
            } else {
                setTimeout(check, intervalMs);
            }
        };
        check();
    });
}

/**
 * Checks if a number is an integer.
 * @param n The number to check.
 * @returns True if integer.
 * @category Utils
 */
export function isInteger(n: number): boolean {
    return Number.isInteger(n);
}

/**
 * Checks if a value is a non-null object.
 * @param value The value to check.
 * @returns True if it is an object.
 * @category Utils
 */
export function isObject(value: any): value is object {
    return typeof value === 'object' && value !== null;
}

/**
 * Checks if a value is a string.
 * @param value The value to check.
 * @returns True if it is a string.
 * @category Utils
 */
export function isString(value: any): value is string {
    return typeof value === 'string' || (value instanceof String);
}

/**
 * Checks if a value is a function.
 * @param value The value to check.
 * @returns True if it is a function.
 * @category Utils
 */
export function isFunction(value: any): value is Function {
    return typeof value === 'function';
}

/**
 * Checks if an object has a specific property.
 * @param obj The object.
 * @param key The property key.
 * @returns True if the object has the property.
 * @category Utils
 */
export function hasOwn(obj: object, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Joins array elements with a separator.
 * @param arr The array.
 * @param separator The separator.
 * @returns The joined string.
 * @category Utils
 */
export function join(arr: any[], separator = ','): string {
    return arr.join(separator);
}

/**
 * Checks if an object is empty (has no enumerable properties).
 * @param obj The object.
 * @returns True if empty.
 * @category Utils
 */
export function isEmpty(obj: object): boolean {
    if (isNullOrUndefined(obj)) return true;
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

/**
 * Converts degrees to radians.
 * @param degrees Angle in degrees.
 * @returns Angle in radians.
 * @category Utils
 */
export function toRadians(degrees: number): number {
    return degrees * DEG2RAD;
}

/**
 * Converts radians to degrees.
 * @param radians Angle in radians.
 * @returns Angle in degrees.
 * @category Utils
 */
export function toDegrees(radians: number): number {
    return radians * RAD2DEG;
}

/**
 * Checks if a Three.js object is a Mesh.
 * @param object The object to check.
 * @returns True if it is a Mesh.
 * @category Utils
 */
export function isMesh(object: Object3D): object is Mesh {
    return (object as any).isMesh === true;
}

/**
 * Loads a texture asynchronously.
 * @param url The texture URL.
 * @returns Promise resolving to the Texture.
 * @category Utils
 */
export async function loadTextureAsync(url: string): Promise<Texture> {
    const loader = new TextureLoader();
    return loader.loadAsync(url);
}

/**
 * Formats a date as "YYYY-MM-DD HH:mm:ss".
 * @param date The date to format. Defaults to now.
 * @returns Formatted string.
 * @category Utils
 */
export function formatDate(date: Date = new Date()): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Checks if an object is within the camera's frustum.
 * @param object The object to check.
 * @param camera The camera.
 * @returns True if intersecting frustum.
 * @category Utils
 */
export function isObjectInFrustum(object: Object3D, camera: Camera): boolean {
    const frustum = new Frustum();
    const matrix = new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(matrix);
    return frustum.intersectsObject(object);
}

/**
 * Calculates the pixel to unit ratio for a given camera and renderer.
 * @param camera The perspective camera.
 * @param renderer The WebGL renderer.
 * @returns The ratio of world units per pixel at the camera's target distance.
 * @category Utils
 */
export function getPixelToUnitRatio(camera: PerspectiveCamera, renderer: WebGLRenderer): number {
    const distance = camera.position.length(); // Assuming looking at origin or similar
    // Note: This logic seems specific to a certain setup. Keeping as is but cleaning up.
    // Ideally distance should be from camera to the plane of interest.
    const fovRad = camera.fov * DEG2RAD;
    const height = 2 * Math.tan(fovRad / 2) * distance;
    const clientHeight = renderer.domElement.clientHeight;
    return clientHeight > 0 ? height / clientHeight : 0;
}
