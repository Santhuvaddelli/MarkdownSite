const username = "Santhuvaddelli";
const repo = "MarkdownSite";
const folder = "posts";

// ========================
// INDEX PAGE - List files
// ========================
if (document.getElementById("postList")) {

    fetch(`https://api.github.com/repos/${username}/${repo}/contents/${folder}`)
        .then(response => response.json())
        .then(data => {

            const postList = document.getElementById("postList");

            data.forEach(file => {
                if (file.name.endsWith(".md")) {

                    const title = file.name
                        .replace(".md", "")
                        .replace(/-/g, " ");

                    const li = document.createElement("li");
                    li.innerHTML = `
                        <a href="post.html?file=${file.name}">
                            ${title}
                        </a>
                    `;
                    postList.appendChild(li);
                }
            });
        });
}

// ========================
// POST PAGE - Render file
// ========================
if (document.getElementById("content")) {

    const params = new URLSearchParams(window.location.search);
    const file = params.get("file");

    if (file) {
        fetch(`posts/${file}`)
            .then(response => response.text())
            .then(text => {
                document.getElementById("content").innerHTML = marked.parse(text);
            });
    }
}