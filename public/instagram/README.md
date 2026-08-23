# Instagram homepage media

Profile: https://www.instagram.com/siconarts/
Artists Works highlight: https://www.instagram.com/stories/highlights/18132383929515105/

## Posts

The compact homepage slider reads images from `public/instagram/feed/`. Name files after the post shortcode so each tile links to that post.

## Highlights (local files)

Instagram does not give websites a Highlights API. Save photos/videos from Artists Works into:

```text
public/instagram/highlights/01.mp4
public/instagram/highlights/01.jpg   optional poster, same name as the video
public/instagram/highlights/02.jpg
```

Videos autoplay muted on the homepage. If Chrome is logged into Instagram, try:

```powershell
python -m yt_dlp --cookies-from-browser chrome "https://www.instagram.com/stories/highlights/18132383929515105/" -o "public/instagram/highlights/%(playlist_index)02d.%(ext)s" --write-thumbnail
```

Close other Chrome windows first so cookies can be read. The homepage always includes an "Open live Highlight" button that opens the real Instagram Highlight.
