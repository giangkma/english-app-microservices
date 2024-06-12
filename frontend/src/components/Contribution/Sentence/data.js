import sentenceApi from 'apis/sentenceApi';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import SentenceContribution from './index';

function SentenceContributionData() {
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const [contributedList, setContributedList] = useState([]);

  // get history contributed
  useEffect(() => {
    getMyHistory();
  }, []);

  const getMyHistory = async () => {
    try {
      const apiRes = await sentenceApi.getMyContributed();
      if (apiRes.status === 200) {
        setContributedList(apiRes.data ?? []);
      }
    } catch (error) {
      dispatch(
        setMessage({
          type: 'error',
          message: 'Lấy lịch sử đóng góp không thành công, thử lại',
        }),
      );
    }
  };

  const handleSubmit = async (formData) => {
    const { sentence, mean, note, topics } = formData;
    try {
      setSubmitting(true);

      const apiRes = await sentenceApi.postContributeSentence(
        sentence,
        mean,
        note,
        topics,
      );
      if (apiRes.status === 200) {
        dispatch(
          setMessage({
            type: 'success',
            message: apiRes.data.message,
            duration: 5000,
          }),
        );
        getMyHistory();
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Thêm câu mới không thành công, thử lại';
      dispatch(
        setMessage({
          type: 'error',
          message,
        }),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SentenceContribution
      submitting={submitting}
      onSubmitForm={handleSubmit}
      contributedList={contributedList}
    />
  );
}

export default SentenceContributionData;
