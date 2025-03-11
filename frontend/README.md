# webty-frontend-next
> 프로그래머스 데브코스: 팀 프로젝트 #2 프론트엔드

한국 웹툰 커뮤니티 'WEBTY'  
프론트엔드

<br>

## 주요 기술 스택

- 프레임워크: Next.js (App Router 기반)
- 언어: TypeScript
- 스타일링: ShadCN, Pretendard
- 아이콘: FontAwesome
- 상태 관리: React Query
- UI 컴포넌트 개발: Storybook
- 인증: 카카오 로그인 API


<br>

## 주요 기능

- 웹툰 리뷰 게시글 피드
- 리뷰 게시글 세부 기능: 스포일러, 추천, 조회수, 파일업로드
- 웹툰 검색 및 관심 웹툰 기능
- 카카오 로그인 (OAuth) 및 프로필 설정


<br>

## 디렉터리 구조

```
├─app //pages
│  │  favicon.ico
│  │  layout.tsx
│  │  page.tsx
│  │
│  ├─callback
│  │      page.tsx
│  │
│  ├─feed
│  │      page.tsx
│  │
│  ├─mypage
│  │      page.tsx
│  │
│  ├─review-detail
│  │  └─[id]
│  │          page.tsx
│  │
│  ├─review-update
│  │  └─[id]
│  │          page.tsx
│  │
│  ├─review-write
│  │      page.tsx
│  │
│  ├─search
│  │      page.tsx
│  │
│  └─webtoon-detail
│      └─[id]
│              page.tsx
│
├─components
│  ├─buisness //business components
│  │  ├─mypage
│  │  │      EditNickname.tsx
│  │  │      ProfileSection.tsx
│  │  │      UserDrawerTaps.tsx
│  │  │
│  │  ├─review
│  │  │      EditReview.tsx
│  │  │      FeedReview.tsx
│  │  │      ReviewContentBox.tsx
│  │  │      ReviewDetail.tsx
│  │  │      ReviewInfo.tsx
│  │  │      ReviewRecommendBox.tsx
│  │  │      UpdateReview.tsx
│  │  │
│  │  ├─search
│  │  │      ReviewSearchResult.tsx
│  │  │      webtoonSearchResult.tsx
│  │  │
│  │  └─webtoonDetail
│  │          WebtoonDrawerTaps.tsx
│  │          WebtoonInfo.tsx
│  │
│  ├─common //non-business components
│  │  ├─CommentList
│  │  │      CommentArea.tsx
│  │  │      CommentItem.stories.tsx
│  │  │      CommentItem.tsx
│  │  │      CommentList.stories.tsx
│  │  │      CommentList.tsx
│  │  │      MentionSuggestions.tsx
│  │  │      NestedCommentItem.tsx
│  │  │      RootCommentItem.tsx
│  │  │
│  │  ├─ExpandableDrawer
│  │  │      ExpandableDrawer.stories.tsx
│  │  │      ExpandableDrawer.tsx
│  │  │
│  │  ├─FavoriteDialog
│  │  │      FavoriteDialog.tsx
│  │  │
│  │  ├─GhostTabs
│  │  │      GhostTabs.tsx
│  │  │
│  │  ├─LargeReviewList
│  │  │      LargeReviewItem.tsx
│  │  │      LargeReviewList.tsx
│  │  │
│  │  ├─LogInOutDialog
│  │  │      LogInOutDialog.tsx
│  │  │
│  │  ├─NavigationBar
│  │  │      hiddenElements.ts
│  │  │      NavigationBar.css
│  │  │      NavigationBar.tsx
│  │  │
│  │  ├─RecommendButton
│  │  │      RecommendButton.tsx
│  │  │
│  │  ├─ResponsiveReviewBox
│  │  │      ResponsiveReviewBox.tsx
│  │  │
│  │  ├─ReviewDialog
│  │  │      InputAlertDialog.tsx
│  │  │      ReviewDialog.tsx
│  │  │
│  │  ├─ReviewForm
│  │  │      ReviewForm.tsx
│  │  │
│  │  ├─ReviewWebtoonBox
│  │  │      ReviewWebtoonBox.tsx
│  │  │
│  │  ├─ReviewWriteModal
│  │  │      ReviewWriteModal.tsx
│  │  │
│  │  ├─SmallReviewList
│  │  │      SmallReviewItem.tsx
│  │  │      SmallReviewList.tsx
│  │  │
│  │  ├─SpoilerButton
│  │  │      SpoilerButton.tsx
│  │  │
│  │  ├─UpdateDeleteButtons
│  │  │      UpdateDeleteButtons.tsx
│  │  │
│  │  ├─WebtoonList
│  │  │      WebtoonItem.tsx
│  │  │      WebtoonList.tsx
│  │  │
│  │  ├─WideReviewBox
│  │  │      WideReviewBox.tsx
│  │  │
│  │  └─WideReviewList
│  │          WideReviewItem.tsx
│  │          WideReviewList.tsx
│  │
│  └─ui //ShardCN UI
│
├─lib
│  ├─api
│  │  ├─review
│  │  │      recommend.ts
│  │  │      review.ts
│  │  │
│  │  ├─reviewComment
│  │  │      reviewComment.ts
│  │  │
│  │  ├─security
│  │  │      useAuth.ts
│  │  │
│  │  ├─user
│  │  │      user.ts
│  │  │
│  │  ├─voting
│  │  │      vote.ts
│  │  │
│  │  └─webtoon
│  │          favorite.ts
│  │          webtoon.ts
│  │
│  ├─types //DTOs
│  │  ├─common
│  │  │      PageDto.ts
│  │  │
│  │  ├─review
│  │  │      ReviewDetailResponseDto.ts
│  │  │      ReviewItemResponseDto.ts
│  │  │      ReviewRequestDto.ts
│  │  │
│  │  ├─reviewComment
│  │  │      CommentRequestDto.ts
│  │  │      CommentResponseDto.ts
│  │  │
│  │  ├─user
│  │  │      UserDataResponseDto.ts
│  │  │
│  │  └─webtoon
│  │          FavoriteDto.ts
│  │          WebtoonDetailDto.ts
│  │          WebtoonSearchRequestDto.ts
│  │          WebtoonSummaryDto.ts
│  │
│  └─utils
│          constants.ts
│          formatDate.ts
│          utils.ts
│
├─stories //Storybook examples
│
└─styles
        globals.css
```


