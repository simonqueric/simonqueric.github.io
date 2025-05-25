---
layout: post
title: An example of non-gaussian multivariate random variable whose marginals are gaussians
date: 2025-05-25
description: an example of a blog post with jupyter notebook
tags:
categories:
giscus_comments: true
related_posts: false
---

To include a jupyter notebook in a post, you can use the following code:

{% raw %}

```liquid
{::nomarkdown}
{% assign jupyter_path = 'assets/jupyter/gaussian_vector.ipynb' | relative_url %}
{% capture notebook_exists %}{% file_exists assets/jupyter/blog.ipynb %}{% endcapture %}
{% if notebook_exists == 'true' %}
  {% jupyter_notebook jupyter_path %}
{% else %}
  <p>Sorry, the notebook you are looking for does not exist.</p>
{% endif %}
{:/nomarkdown}
```

{% endraw %}

{::nomarkdown}
{% assign jupyter_path = "assets/jupyter/gaussian_vector.ipynb" | relative_url %}
{% capture notebook_exists %}{% file_exists assets/jupyter/blog.ipynb %}{% endcapture %}
{% if notebook_exists == "true" %}
{% jupyter_notebook jupyter_path %}
{% else %}

<p>Sorry, the notebook you are looking for does not exist.</p>
{% endif %}
{:/nomarkdown}
