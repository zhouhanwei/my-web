/*
 * @Author: zhouhanwei sgzhouhanwei@163.com
 * @Date: 2025-03-11 20:16:52
 * @LastEditors: zhouhanwei sgzhouhanwei@163.com
 * @LastEditTime: 2025-03-11 21:44:43
 * @FilePath: /my-web/src/App.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ArticleDetails from './ArticleDetails';

const socket = io('http://localhost:3000'); // 后端服务器地址

const App = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // 先从 /scrape 接口获取数据
    fetch('http://localhost:3000/scrape')
      .then(response => response.json())
      .then(res => {
        setArticles(res.data);
      })
      .catch(error => {
        console.error('Error fetching initial data:', error);
      });

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('update', (data) => {
      console.log('Received update:', data);
      setArticles((prevArticles) => [data, ...prevArticles]);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.off('connect');
      socket.off('update');
      socket.off('disconnect');
    };
  }, []);

  const Home = ()=>{
    return (
      <div>
        <h1>Articles</h1>
        <ul>
          {articles.map((article) => (
            <li key={article.id}>
              <Link to={`/details?articleId=${article.articleId}&channelId=${article.channelId}`}>
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route path="/details" element={<ArticleDetails/>} />
      </Routes>
    </Router>
  );
};

export default App;