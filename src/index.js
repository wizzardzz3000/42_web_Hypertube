import React from 'react';
import { render } from 'react-dom'
import MainRouter from './routes';
import './index.scss'

render(
  <MainRouter/>,
  document.getElementById("root")
);
