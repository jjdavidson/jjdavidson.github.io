---
layout: default
title: Teaching
permalink: /teaching/
nav_order: 4
---

# Teaching

{% for p in site.teaching %}
- [{{ p.title }}]({{ p.url }})
{% endfor %}
