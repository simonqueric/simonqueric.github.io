---
layout: post
title: Example of non gaussian vector whose marginals are gaussian
date: 2025-05-25
description: 
tags: 
categories: 
giscus_comments: true
related_posts: false
---

A gaussian vector is a multivariate random variable $X_{1:d} \in \mathbb{R}^d$ such that for any $a_{1:d} \in \mathbb{R}^d$, $a^T X$ is a normal distributed random variable. 
Following this definition, it's clear that the marginals of $X$ are normal distributed, but the converse is not true as showing below.

{::nomarkdown}
{% assign jupyter_path = "assets/jupyter/gaussian_vector.ipynb" | relative_url %}
{% capture notebook_exists %}{% file_exists assets/jupyter/blog.ipynb %}{% endcapture %}
{% if notebook_exists == "true" %}
{% jupyter_notebook jupyter_path %}
{% else %}

<p>Sorry, the notebook you are looking for does not exist.</p>
{% endif %}
{:/nomarkdown}
