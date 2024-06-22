import FavoriteDictionaryData from 'components/DynoDictionary/Favorite/data';
import useTitle from 'hooks/useTitle';
import React from 'react';

function FavoriteDictionaryPage() {
  useTitle('Danh sách từ vựng yêu thích');

  return <FavoriteDictionaryData />;
}

export default FavoriteDictionaryPage;
