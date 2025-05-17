import wikipediaapi

def content_get(location, data_type="summary"):
    wiki = wikipediaapi.Wikipedia(user_agent='intel-hackathon-scu-2025', language="en")

    page = wiki.page(location)

    if not page.exists():
        raise RuntimeError(f"No Wikipedia page found for '{location}'")

    dispatch = {
        "summary":      lambda p: p.summary,
        "content":      lambda p: p.text,
        "title":        lambda p: p.title,
        "url":          lambda p: p.fullurl,
        "sections":     lambda p: [s.title for s in p.sections],
        "categories":   lambda p: list(p.categories.keys()),
    }

    key = data_type.lower()
    if key not in dispatch:
        valid = ", ".join(dispatch.keys())
        raise ValueError(f"data_type must be one of: {valid!r}")

    return dispatch["title"](page), dispatch[key](page)
"""
import wikipedia
from wikipedia import DisambiguationError, PageError
import requests


def content_get(location, data_type="content"):
    try:
        page_object = wikipedia.page(location)
    except DisambiguationError as e:
        try:
            page_object = wikipedia.page(e.options[0], auto_suggest=False)
        except Exception as inner_e:
            raise RuntimeError(f"Failed to resolve disambiguation for '{location}': {inner_e}")
    except PageError as e:
        raise RuntimeError(f"Page not found for '{location}': {e}")
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Network or request error while fetching '{location}': {e}")
    except requests.exceptions.JSONDecodeError as e:
        raise RuntimeError(f"Invalid JSON response from Wikipedia for '{location}': {e}")
    except Exception as e:
        raise RuntimeError(f"Unexpected error while fetching '{location}': {e}")

    dispatch = {
        "content":      lambda p: p.content,
        "summary":      lambda p: p.summary,
        "html":         lambda p: p.html(),
        "title":        lambda p: p.title,
        "original":     lambda p: p.original_title,
        "links":        lambda p: p.links,
        "images":       lambda p: p.images,
        "references":   lambda p: p.references,
        "categories":   lambda p: p.categories,
        "coordinates":  lambda p: p.coordinates,
        "url":          lambda p: p.url,
    }

    key = data_type.lower()
    if key not in dispatch:
        valid = ", ".join(dispatch.keys())
        raise ValueError(f"data_type must be one of: {valid!r}")

    return dispatch[key](page_object)
"""