find . -name '*html.twig.html' | while read f; do mv "$f" "${f//twig.html/twig}"; done
