---
layout: default
title: Research
permalink: /research/
nav_order: 5
---

# Research

{% for p in site.research %}
- [{{ p.title }}]({{ p.url }})
{% endfor %}
