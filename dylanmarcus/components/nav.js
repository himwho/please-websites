import Link from 'next/link';
import React from 'react';
import './nav.css';

const Nav = () => (
	<div>
	  <div class="float-nav">
	    <a href="#" class="menu-btn">
	      <ul>
	        <li class="line"></li>
	        <li class="line"></li>
	        <li class="line"></li>
	      </ul>
	      <div class="menu-txt">menu</div>
	    </a>
	  </div>
	  <div class="main-nav">
	    <ul>
	      <li>
	        <Link href="/">
	          <a href="#">Home</a>
	        </Link>
	      </li>
	      <li>
	        <Link href="/about">
	          <a href="#">About</a>
	        </Link>
	      </li>
	    </ul>
	  </div>
	</div>
);

export default Nav;
