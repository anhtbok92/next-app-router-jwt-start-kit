'use client';

const OverViewErrorPage = ({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <h1>Đã có lỗi xảy ra!</h1>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Thử lại</button>
    </div>
  );
};

export default OverViewErrorPage;
