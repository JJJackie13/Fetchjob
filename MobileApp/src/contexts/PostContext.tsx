import React, {createContext, useContext, useEffect, useState} from 'react';
import {API_URL} from '@env';
import {PostProps} from '../types/types';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PostContext = createContext<any>(undefined!);

export const usePost = () => useContext(PostContext);

const PostProvider: React.FC<any> = (props) => {
    const [posts, setPosts] = useState<PostProps[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [isAllFetched, setIsAllFetched] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [loadingExtraPost, setLoadingExtraPost] = useState<boolean>(false);
    let values = {
        posts,
        isAllFetched,
        isLoading,
        loadingExtraPost,
        setLoadingExtraPost,
        fetchThread,
    };

    async function fetchThread(init: boolean = true) {
        try {
            if (init) {
                setIsLoading(true);
                setPosts([]);
                setOffset(0);
                setIsAllFetched(false);
            }
            if (isAllFetched) {
                return;
            }
            const res = await fetch(
                `${API_URL}/thread/connected?offset=${init ? 0 : offset}`,
                {
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem(
                            'token',
                        )}`,
                    },
                },
            );
            if (res.ok) {
                const threads = (await res.json()).data;
                if (init) {
                    setPosts(threads);
                    setOffset((prev) => prev + 1);
                } else if (threads.length === 0) {
                    setIsAllFetched(true);
                } else {
                    setPosts((prev) => {
                        return [...prev, ...threads];
                    });
                    setOffset((prev) => prev + 1);
                }
            } else {
                console.log((await res.json()).message);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
            setLoadingExtraPost(false);
        }
    }

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            values = {
                posts,
                isAllFetched,
                isLoading,
                loadingExtraPost,
                setLoadingExtraPost,
                fetchThread,
            };
        }
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <PostContext.Provider value={values}>
            {props.children}
        </PostContext.Provider>
    );
};

export default PostProvider;
