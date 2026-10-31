---
layout: default
title: Pi Day
parent: Teaching
has_children: true
has_toc: false
nav_order: 2
permalink: /teaching/pi-day/
---

# Pi Day

A geometric probability demonstration for Pi Day.

{% assign resources = site.pages | where: "parent", page.title | where: "grand_parent", page.parent | sort: "nav_order" %}
{% for resource in resources %}
- [{{ resource.title }}]({{ resource.url | relative_url }})
{% endfor %}
