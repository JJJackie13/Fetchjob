import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JobCardHorizontal from '../Job/JobCardHorizontal';
import {API_URL} from '@env';
import {colors, FONTS, sizes} from '../../constants';

const CompanyJobSection: React.FC<any> = ({
    scrollRefresh,
    setScrollRefresh,
    companyId,
}) => {
    function renderJobList() {
        const limit = 5;
        const [jobs, setJobs] = useState<any[]>([]);
        const [offset, setOffset] = useState<number>(0);
        const [isAllFetched, setIsAllFetched] = useState<boolean>(false);

        async function fetchThread(init: boolean = true) {
            try {
                if (init) {
                    setJobs([]);
                    setOffset(0);
                    setIsAllFetched(false);
                }
                if (isAllFetched || !companyId) {
                    return;
                }
                const res = await fetch(
                    `${API_URL}/job/company/${companyId}/all`,
                    {
                        headers: {
                            Authorization: `Bearer ${await AsyncStorage.getItem(
                                'token',
                            )}`,
                        },
                    },
                );
                if (res.ok) {
                    const jobs = await res.json();
                    console.log(jobs);
                    if (init) {
                        setJobs(jobs);
                        // setOffset((prev) => prev + 1);
                    } else if (jobs.length === 0) {
                        setIsAllFetched(true);
                    } else {
                        setJobs((prev) => {
                            return [...prev, ...jobs];
                        });
                        // setOffset((prev) => prev + 1);
                    }
                } else {
                    console.log((await res.json()).message);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setScrollRefresh(false);
            }
        }

        function renderMorePost() {
            setOffset((prev) => (prev += 1));
        }

        function renderJobList() {
            return (
                <View>
                    {jobs
                        .filter((_, i) => i < limit + limit * offset)
                        .map((job, i) => (
                            <JobCardHorizontal
                                key={`${job.id}`}
                                data={job}
                                lastData={i === jobs.length - 1}
                            />
                        ))}
                    {jobs.length > 1 && limit + limit * offset < jobs.length ? (
                        <TouchableOpacity
                            style={styles.showMoreBtn}
                            onPress={renderMorePost}>
                            <Text style={{color: colors.button}}>
                                Show More
                            </Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            );
        }

        function renderNoPostCard() {
            return (
                <View style={styles.noPostCard}>
                    <FontAwesome5
                        name="suitcase"
                        size={sizes.width * 0.2}
                        color={colors.icon}
                        style={{
                            padding: 15,
                            borderWidth: 1,
                            borderColor: '#ccc',
                            borderRadius: 25,
                            marginBottom: 10,
                        }}
                    />
                    <Text
                        style={{
                            ...FONTS.paragraph,
                            color: colors.icon,
                            fontWeight: 'bold',
                        }}>
                        No Job Yet
                    </Text>
                </View>
            );
        }

        useEffect(() => {
            let isMount = true;
            if (isMount) {
                fetchThread(true);
            }
            return () => {
                isMount = false;
            };
        }, []);

        useEffect(() => {
            if (scrollRefresh) {
                fetchThread(true);
            }
        }, [scrollRefresh]);

        return (
            <View>
                {jobs && jobs.length > 0 ? renderJobList() : renderNoPostCard()}
            </View>
        );
    }

    return <View style={styles.container}>{renderJobList()}</View>;
};

export default CompanyJobSection;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    showMoreBtn: {
        elevation: 5,
        marginVertical: 10,
        marginHorizontal: 5,
        marginTop: 5,
        height: sizes.height * 0.05,
        backgroundColor: colors.main,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    noPostCard: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // height: 400,
        minHeight: 300,
        width: sizes.width - 10,
        marginHorizontal: 5,
        marginTop: 5,
        borderRadius: 5,
        backgroundColor: colors.main,
        elevation: 1,
        overflow: 'hidden',
    },
});
