import wordApi from 'apis/wordApi';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import WordContribution from './index';

const analysisExample = (exampleStr = '', word = '') => {
  if (typeof exampleStr !== 'string' || exampleStr === '') {
    return [];
  }

  const exampleArr = exampleStr.split('\n');
  for (let str of exampleArr) {
    if (str.toLocaleLowerCase().indexOf(word.toLocaleLowerCase()) === -1) {
      return false;
    }
  }

  return exampleArr;
};

function WordContributionData({ wordEdit, editSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const [contributedList, setContributedList] = useState([]);
  const { isAuth } = useSelector((state) => state.userInfo);

  // get history contributed
  useEffect(() => {
    getMyHistory();
  }, [isAuth]);

  const getMyHistory = async () => {
    try {
      if (!isAuth || !!wordEdit) return;
      const apiRes = await wordApi.getMyContributed();
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

  const handleSubmit = async (data) => {
    try {
      setSubmitting(true);
      const { examples, synonyms, antonyms, word, phonetic, ...rest } = data;

      // check examples validation
      const exampleArr = analysisExample(examples, word);
      if (typeof exampleArr === 'boolean' && !exampleArr) {
        dispatch(
          setMessage({
            type: 'warning',
            message: 'Câu ví dụ phải chứa từ vựng mới.',
          }),
        );
        setSubmitting(false);
        return;
      }

      // split synonyms string to an array synonyms
      const synonymArr = synonyms !== '' ? synonyms.split('\n') : [];

      // split antonyms string to an array synonyms
      const antonymArr = antonyms !== '' ? antonyms.split('\n') : [];

      // call API
      const dataSend = {
        ...rest,
        examples: exampleArr,
        synonyms: synonymArr,
        antonyms: antonymArr,
        word,
        phonetic: phonetic.replaceAll('/', ''),
      };

      let apiRes;
      if (wordEdit) {
        apiRes = await wordApi.updateWord({
          id: wordEdit._id,
          wordInfor: dataSend,
        });
      } else {
        apiRes = await wordApi.postContributeWord(dataSend);
      }

      if (apiRes.status === 200) {
        dispatch(
          setMessage({
            type: 'success',
            message: apiRes.data.message,
            duration: 5000,
          }),
        );
        getMyHistory();
        setSubmitting(false);
        editSuccess && editSuccess();
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Không thành công, hãy thử lại';
      dispatch(
        setMessage({
          type: 'error',
          message,
        }),
      );
      setSubmitting(false);
    }
  };

  return (
    <WordContribution
      contributedList={contributedList}
      onSubmitForm={handleSubmit}
      submitting={submitting}
      wordEdit={wordEdit}
    />
  );
}

export default WordContributionData;
