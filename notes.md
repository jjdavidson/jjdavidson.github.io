---
layout: default
title: Math Notes
permalink: /notes/
---

# Math Notes

{% for p in site.notes %}
- [{{ p.title }}]({{ p.url }})
{% endfor %}
