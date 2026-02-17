---
layout: default
title: Research
permalink: /research/
---

# Research

{% for p in site.research %}
- [{{ p.title }}]({{ p.url }})
{% endfor %}
