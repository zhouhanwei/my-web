/*
 * @Author: zhouhanwei sgzhouhanwei@163.com
 * @Date: 2025-03-11 21:26:57
 * @LastEditors: zhouhanwei sgzhouhanwei@163.com
 * @LastEditTime: 2025-03-11 22:16:46
 * @FilePath: /my-web/src/ArticleDetails.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

const ArticleDetails = () => {
  const [article, setArticle] = useState(null);
  const location = useLocation();
//   const history = useHistory();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const articleId = queryParams.get('articleId');
    const channelId = queryParams.get('channelId');

    fetch(`http://localhost:3000/scrape/detail?articleId=${articleId}&channelId=${channelId}`)
      .then(response => response.json())
      .then(res => {
        setArticle(res.data);
      })
      .catch(error => {
        console.error('Error fetching article details:', error);
      });
  }, [location.search]);

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{article.title}</h1>
      <p>Date: {article.info}</p>
      <p>{article.content}</p>
      {/* <button onClick={() => history.goBack()}>后退</button> */}
    </div>
  );
};

export default ArticleDetails;