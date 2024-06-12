import React, { useState } from 'react';
import SentenceContributionData from './Sentence/data';
import useStyle from './style';
import WordContributionData from './Word/data';
import { useSelector } from 'react-redux';

function Contribution() {
  const { isContributor } = useSelector((state) => state.userInfo);
  const classes = useStyle();
  const [mode, setMode] = useState(0);

  return (
    <div className="container">
      <div className={classes.root}>
        <ul className={classes.tabs}>
          <li
            className={`${classes.tab} ${mode === 0 ? 'active' : ''}`}
            onClick={() => setMode(0)}>
            Thêm từ
          </li>
          <li
            className={`${classes.tab} ${mode === 1 ? 'active' : ''}`}
            onClick={() => setMode(1)}>
            Thêm câu
          </li>
        </ul>

        <div className={classes.tabContent}>
          {isContributor && (
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                color: '#333',
              }}>
              Bạn là Contributor của Amonino, nên các từ và câu của bạn sẽ không
              cần sét duyệt từ Admin
            </h1>
          )}

          {mode === 0 ? (
            <div className="ani-fade">
              <WordContributionData />
            </div>
          ) : (
            <div className="ani-zoom">
              <SentenceContributionData />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Contribution;
