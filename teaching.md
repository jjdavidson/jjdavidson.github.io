---
layout: default
title: Teaching
permalink: /teaching/
---

# Teaching

{% for p in site.teaching %}
- [{{ p.title }}]({{ p.url }})
{% endfor %}
