import LoopIcon from '@material-ui/icons/Loop';
import AutoSearchInput from 'components/UI/AutoSearchInput';
import InfiniteScroll from 'components/UI/InfiniteScroll';
import WordSortModal from 'components/UI/WordSortModal';
import PropTypes from 'prop-types';
import React from 'react';
import DynoDictionaryItemData from './Item/data';
import DDSettingWordPack from './SettingWordPack';
import DynoDictionarySkeleton from './Skeleton';
import useStyle from './style';

function DynoDictionary({
  list,
  loading,
  onLoadData,
  more,
  isFirstLoad,
  onSettingWordPack,
  onSortTypeChange,
  onSearchWord,
  isTOEIC,
  totalWords,
  ...props
}) {
  const classes = useStyle();

  return (
    <div className={`${classes.root} dyno-container`}>
      {/* title - menu */}
      <div className="flex-center-between">
        <h1 className="dyno-title">{isTOEIC ? 'Từ vựng TOEIC' : 'Từ điển'}</h1>
        <div>
          <WordSortModal
            onSelect={onSortTypeChange}
            classNameIcon="dyno-setting-icon mr-5"
          />
          {!isTOEIC && (
            <DDSettingWordPack
              onChoose={onSettingWordPack}
              classNameIcon="dyno-setting-icon"
            />
          )}
        </div>
      </div>
      <p
        style={{
          color: '#666',
          fontSize: '16px',
          textAlign: 'left',
          marginBottom: '10px',
        }}>
        Tổng số từ đang có: <b>{totalWords}</b>
        <br />
        <br />
        <b>Chú ý:</b> Từ điển này chỉ mang tính chất tham khảo, không chính xác
        100%
      </p>
      <div className="dyno-break"></div>

      {/* list content */}
      <div className={classes.contentWrap}>
        <AutoSearchInput disabled={loading} onSearch={onSearchWord} />

        <div className={`${classes.listWrap} w-100`}>
          <ul id="dictionaryId" className={`${classes.list} flex-col w-100`}>
            <>
              {isFirstLoad ? (
                <DynoDictionarySkeleton className={classes.skeleton} />
              ) : (
                <>
                  {list && list.length > 0 ? (
                    <>
                      {/* render list */}
                      {list.map((item, index) => (
                        <li className={classes.listItem} key={index}>
                          <DynoDictionaryItemData {...props} {...item} />
                        </li>
                      ))}

                      {/* infinite scrolling */}
                      {!loading && more && (
                        <InfiniteScroll
                          onTouchAnchor={onLoadData}
                          threshold={1}>
                          <div className="w-100 t-center">
                            <LoopIcon className="ani-spin" />
                          </div>
                        </InfiniteScroll>
                      )}
                    </>
                  ) : (
                    // empty list
                    <h3 className="notfound-title h-100 flex-center t-center">
                      Không tìm thấy từ nào trong từ điển
                    </h3>
                  )}
                </>
              )}
            </>
          </ul>
        </div>
      </div>
    </div>
  );
}

DynoDictionary.propTypes = {
  isFirstLoad: PropTypes.bool,
  isTOEIC: PropTypes.bool,
  list: PropTypes.array,
  loading: PropTypes.bool,
  more: PropTypes.bool,
  onLoadData: PropTypes.func,
  onSearchWord: PropTypes.func,
  onSettingWordPack: PropTypes.func,
  onSortTypeChange: PropTypes.func,
  totalWords: PropTypes.number,
};

DynoDictionary.defaultProps = {
  list: [],
  loading: false,
  more: true,
  isFirstLoad: true,
  isTOEIC: false,
  onLoadData: function () {},
  onSearchWord: function () {},
  onSettingWordPack: function () {},
  onSortTypeChange: function () {},
  totalWords: 0,
};

export default DynoDictionary;
