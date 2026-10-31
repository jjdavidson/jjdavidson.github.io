---
layout: default
title: STEM Outreach
parent: Teaching
has_children: true
has_toc: false
nav_order: 1
permalink: /teaching/stem-outreach/
---

# STEM Outreach

Teaching resources on random walks, Brownian motion, and disease spread.

{% assign resources = site.pages | where: "parent", page.title | where: "grand_parent", page.parent | sort: "nav_order" %}
{% for resource in resources %}
- [{{ resource.title }}]({{ resource.url | relative_url }})
{% endfor %}
