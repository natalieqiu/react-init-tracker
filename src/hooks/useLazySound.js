// hooks/useLazySound.js
import { useRef, useCallback, useState, useEffect } from 'react';
import { Howl } from 'howler';

export function useLazySound(soundPath, options = {}) {
    const soundRef = useRef(null);
    const [state, setState] = useState({
        isLoaded: false,
        isLoading: false,
        error: null
    });

    // Load sound on demand
    const load = useCallback(async () => {
        if (state.isLoaded || state.isLoading || !soundPath) return;

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            soundRef.current = new Howl({
                src: [soundPath],
                preload: false,
                onload: () => {
                    setState({ isLoaded: true, isLoading: false, error: null });
                    options.onLoad?.();
                },
                onloaderror: (id, error) => {
                    setState({ isLoaded: false, isLoading: false, error });
                    options.onError?.(error);
                },
                ...options
            });

            // Trigger loading
            soundRef.current.load();

        } catch (error) {
            setState({ isLoaded: false, isLoading: false, error });
        }
    }, [soundPath, state.isLoaded, state.isLoading, options]);

    // Play sound (auto-loads if not loaded)
    const play = useCallback((autoLoad = true) => {
        if (!soundRef.current) {
            if (autoLoad) {
                load(); // Auto-load if not loaded
            }
            return;
        }

        if (state.isLoaded) {
            soundRef.current.play();
        }
    }, [load, state.isLoaded]);

    // Preload on user interaction
    const preloadOnInteraction = useCallback((event) => {
        event.preventDefault();
        load();
    }, [load]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (soundRef.current) {
                soundRef.current.unload();
            }
        };
    }, []);

    return {
        load,
        play,
        preloadOnInteraction,
        isLoaded: state.isLoaded,
        isLoading: state.isLoading,
        error: state.error,
        soundInstance: soundRef.current
    };
}