'use client';

import { useState, useEffect } from 'react';
import { WebtoonDetailDto } from '@/lib/types/webtoon/WebtoonDetailDto';
import { recommendWebtoons } from '@/lib/api/userActivity/logUserActivity';
import { fetchWebtoonById } from '@/lib/api/webtoon/webtoon';
import { useAuth } from '@/lib/api/security/useAuth';
import RecommendWebtoonList from '@/components/common/recommendWebtoonList/RecommendWebtoonList';

const RecommendWebtoon: React.FC = () => {
    const [webtoons, setWebtoons] = useState<WebtoonDetailDto[]>([]);

    // userId를 받으면 웹툰 추천 목록(웹툰id 리스트)을 가져오는 함수
    const fetchRecommendedWebtoons = async (userId: number) => {

        try {
            // 추천 웹툰 ID 리스트 받기
            const webtoonIds: string[] = await recommendWebtoons(userId);  
            
            
            if (webtoonIds.length > 0) {
                // webtoonDetail : 사용자의 추천웹툰정보 리스트

                 // 각 웹툰 ID에 대해 웹툰 상세 정보를 가져오는 API 호출
                 const webtoonDetails = await Promise.all(
                    
                     webtoonIds.map(async (webtoonId) => {
                        return fetchWebtoonById(webtoonId) 
                         // 매개변수 타입 :string =>  리턴타입 : promise<WebtoonDetailDto>  
                     })
                 );
                 // 받은 상세 정보를 상태에 저장
                 setWebtoons(webtoonDetails);  
            }
        } catch (error) {
            console.error('웹툰 추천 가져오기 실패:', error);  // 에러 처리
        }
    };

    //loginId 받아오기, login상태
    const { loginId , isLoggedIn } = useAuth();

    //loginId로 추천웹툰정보 받아오기
    useEffect(() => {
        if (loginId) {
            fetchRecommendedWebtoons(loginId); 
        }
    }, [loginId]); 

    return (
        <RecommendWebtoonList webtoons={webtoons} isLoggedIn = {isLoggedIn ?? false}/>
    );

};

export default RecommendWebtoon;