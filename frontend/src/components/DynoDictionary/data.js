import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import flashcardApi from 'apis/flashcardApi';
import wordApi from 'apis/wordApi';
import WordDetailModal from 'components/UI/WordDetailModal';
import { TOEIC_KEY } from 'constant/topics';
import { equalArray } from 'helper';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import DynoDictionary from '.';
import React from 'react';
import WordContributionData from 'components/Contribution/Word/data';

const perPage = 20;

function DynoDictionaryData({ isTOEIC }) {
  const [page, setPage] = useState(1);
  const [sortType, setSortType] = useState('rand');
  const [packInfo, setPackInfo] = useState(() => ({
    type: '-1',
    level: '-1',
    specialty: '-1',
    topics: isTOEIC ? [TOEIC_KEY] : [],
  }));
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [more, setMore] = useState(true); // toggle infinite scrolling
  const [totalWords, setTotalWords] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const totalPage = useRef(0);
  const preSearchList = useRef([]);

  const nextPage = () => {
    if (page < totalPage.current) {
      setPage(page + 1);
    } else {
      setMore(false);
    }
  };

  const settingWordPack = (info) => {
    // check old pack vs new pack
    let isEqual = true;
    for (let k in packInfo) {
      if (k !== 'topics' && packInfo[k] !== info[k]) {
        isEqual = false;
        break;
      }
    }
    if (isEqual) isEqual = equalArray(packInfo.topics, info.topics);

    totalPage.current = 0;
    preSearchList.current = [];
    setMore(true);
    setList([]);
    setPackInfo(info);
    setPage(1);
  };

  const onSortTypeChange = (type = 'rand') => {
    if (type === sortType) return;
    preSearchList.current = [];
    setSortType(type);
    setPage(1);
    setList([]);
  };

  const onSearchWord = async (word) => {
    try {
      if (word === '') {
        setList(preSearchList.current);
        setMore(true);
        return;
      }

      const apiRes = await wordApi.getSearchWord(word);
      if (apiRes.status === 200) {
        const { packList = [] } = apiRes.data;
        setList(packList);
        setMore(false);
      }
    } catch (error) {}
  };

  // get total word pack
  useEffect(() => {
    let isSub = true;

    (async function () {
      try {
        const apiRes = await flashcardApi.getWordPackTotal(packInfo);
        if (apiRes.status === 200 && isSub) {
          const { total = 0 } = apiRes.data;
          setTotalWords(total);
          totalPage.current = Math.ceil(total / perPage);
        }
      } catch (error) {}
    })();

    return () => (isSub = false);
  }, [packInfo]);

  const getWordPack = async () => {
    let isSub = true;

    try {
      setLoading(true);
      const apiRes = await wordApi.getWordList(
        page,
        perPage,
        packInfo,
        sortType,
      );
      if (apiRes.status === 200 && isSub) {
        const { packList = [] } = apiRes.data;
        const newList = [...list, ...packList];
        preSearchList.current = newList;
        setList(newList);
      }
    } catch (error) {
    } finally {
      if (isSub) {
        setLoading(false);
        isFirstLoad && setIsFirstLoad(false);
      }
    }

    return () => (isSub = false);
  };

  // get word pack
  useEffect(() => {
    getWordPack();
  }, [page, packInfo, sortType]);

  const dispatch = useDispatch();
  const [wordEdit, setWordEdit] = useState(undefined);

  const onEdit = async (word) => {
    try {
      setLoading(true);
      const apiRes = await wordApi.getWordDetails(word);
      if (apiRes.status === 200) {
        setWordEdit(apiRes.data);
      }
    } catch (error) {
      dispatch(
        setMessage({
          type: 'error',
          message: 'Không thể lấy thông tin, thử lại.',
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {wordEdit && (
        <Dialog
          aria-labelledby="word dialog"
          disableBackdropClick={true}
          maxWidth="md"
          open={open}>
          <div>
            <CloseIcon
              onClick={() => setWordEdit(undefined)}
              className="cur-pointer"
            />
          </div>
          <WordContributionData
            editSuccess={() => {
              setWordEdit(undefined);
            }}
            wordEdit={wordEdit}
          />
        </Dialog>
      )}
      <DynoDictionary
        isTOEIC={isTOEIC}
        list={list}
        loading={loading}
        onLoadData={nextPage}
        more={more}
        isFirstLoad={isFirstLoad}
        onSettingWordPack={settingWordPack}
        onSortTypeChange={onSortTypeChange}
        onSearchWord={onSearchWord}
        totalWords={totalWords}
        onEdit={onEdit}
      />
      <WordDetailModal />
    </>
  );
}

DynoDictionaryData.defaultProps = {
  isTOEIC: false,
};

export default DynoDictionaryData;
