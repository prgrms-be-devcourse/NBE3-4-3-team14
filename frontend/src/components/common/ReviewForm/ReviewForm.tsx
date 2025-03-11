'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReviewDialog from '@/components/common/ReviewDialog/ReviewDialog';
import InputAlert from '@/components/common/ReviewDialog/InputAlertDialog';
import { useRouter } from 'next/navigation';
import { ReviewRequestDto } from '@/lib/types/review/ReviewRequestDto';

interface ReviewFormProps {
  mode: 'write' | 'edit';
  webtoonName: string;
  webtoonId: number;
  initialTitle?: string;
  initialContent?: string;
  initialImages?: string[]; // 기존 이미지 URL 목록
  initialSpoilerStatus?: boolean;
  onSubmit: (reviewRequestDto: ReviewRequestDto) => Promise<number | null>;
  onDeleteImage?: (deletedImageUrl: string) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  mode,
  webtoonName,
  webtoonId,
  initialTitle = '',
  initialContent = '',
  initialImages = [],
  initialSpoilerStatus = false,
  onSubmit,
  onDeleteImage,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [spoilerStatus, setSpoilerStatus] = useState(initialSpoilerStatus);
  const [imageUrls, setImageUrls] = useState<string[]>(initialImages); // 기존 이미지
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]); // 새로 업로드한 파일
  const [deletedImages, setDeletedImages] = useState<string[]>([]); // 삭제된 기존 이미지 저장
  const router = useRouter();

  // 다이얼로그 상태
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState<(() => void) | null>(
    null
  );
  const [inputAlertOpen, setInputAlertOpen] = useState(false);
  const [inputAlertMessage, setInputAlertMessage] = useState('');

  // 파일 추가
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)]);
    }
  };

  // 업로드한 파일 삭제
  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  // 기존 이미지 삭제
  const handleRemoveImageUrl = (index: number) => {
    const deletedImageUrl = imageUrls[index];
    setImageUrls(imageUrls.filter((_, i) => i !== index));
    setDeletedImages((prev) => [...prev, deletedImageUrl]);

    // 부모 컴포넌트에 삭제된 이미지 정보 전달 (ReviewUpdate에서 사용)
    if (onDeleteImage) {
      onDeleteImage(deletedImageUrl);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setInputAlertMessage('제목을 입력해주세요.');
      setInputAlertOpen(true);
      return;
    }

    if (!content.trim()) {
      setInputAlertMessage('내용을 입력해주세요.');
      setInputAlertOpen(true);
      return;
    }

    const reviewRequestDto: ReviewRequestDto = {
      title,
      content,
      webtoonId,
      spoilerStatus: spoilerStatus ? 'TRUE' : 'FALSE',
      images: uploadedFiles, // 기존 이미지 + 새로 업로드한 이미지
    };

    const reviewId = await onSubmit(reviewRequestDto);

    if (reviewId) {
      setAlertTitle(mode === 'write' ? '리뷰 작성 완료' : '리뷰 수정 완료');
      setAlertDescription(
        mode === 'write'
          ? '리뷰가 성공적으로 작성되었습니다!'
          : '리뷰가 성공적으로 수정되었습니다!'
      );
      setOnConfirmAction(() => () => {
        router.push(`/review-detail/${reviewId}`);
      });
    } else {
      setAlertTitle(mode === 'write' ? '리뷰 작성 실패' : '리뷰 수정 실패');
      setAlertDescription(
        mode === 'write'
          ? '리뷰 작성에 실패했습니다.'
          : '리뷰 수정에 실패했습니다.'
      );
      setOnConfirmAction(null);
    }
    setAlertOpen(true);
  };

  return (
    <Card className="w-full max-w-[90vw] max-h-[95vh] overflow-y-auto p-10 shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">
          <span className="text-4xl">"{webtoonName}" </span>
          {mode === 'write' ? '리뷰 작성' : '리뷰 수정'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-8">
          {/* 제목 입력 */}
          <div>
            <Label htmlFor="title" className="text-lg mb-2 block">
              제목
            </Label>
            <Input
              id="title"
              placeholder="리뷰 제목을 입력해주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>

          {/* 내용 입력 */}
          <div>
            <Label htmlFor="content" className="text-lg mb-2 block">
              내용
            </Label>
            <Textarea
              id="content"
              placeholder="리뷰 내용을 입력해주세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={11}
              className="w-full"
            />
          </div>

          {/* 스포일러 여부 */}
          <div className="flex items-center gap-4">
            <Label htmlFor="spoilerStatus" className="text-lg">
              스포일러 여부
            </Label>
            <Switch
              id="spoilerStatus"
              checked={spoilerStatus}
              onCheckedChange={setSpoilerStatus}
            />
          </div>

          {/* 기존 이미지 미리보기 및 삭제 */}
          {imageUrls.length > 0 && (
            <div>
              <Label className="text-lg mb-2 block">기존 이미지</Label>
              <div className="flex flex-wrap gap-2">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt="기존 이미지"
                      className="w-24 h-24 object-cover rounded"
                    />
                    <button
                      onClick={() => handleRemoveImageUrl(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 파일 업로드 */}
          <div>
            <Label htmlFor="images" className="text-lg mb-2 block">
              이미지 업로드
            </Label>
            <Button
              type="button"
              onClick={() => document.getElementById('images')?.click()}
            >
              파일 선택
            </Button>
            <Input
              id="images"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            {/* 업로드한 파일 리스트 */}
            {uploadedFiles.length > 0 && (
              <div className="mt-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span>{file.name}</span>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end mt-8">
          <Button onClick={handleSubmit} className="px-6 py-2 text-lg">
            {mode === 'write' ? '리뷰 작성' : '리뷰 수정'}
          </Button>
        </div>
      </CardContent>

      {/* 다이얼로그 */}
      <InputAlert
        isOpen={inputAlertOpen}
        onClose={() => setInputAlertOpen(false)}
        message={inputAlertMessage}
      />
      <ReviewDialog
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        title={alertTitle}
        description={alertDescription}
        onConfirm={onConfirmAction}
      />
    </Card>
  );
};

export default ReviewForm;
