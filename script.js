const username = "Santhuvaddelli";
const repo = "MarkdownSite";
const baseFolder = "posts";

// ===============================
// INDEX PAGE - Load Categories
// ===============================
if (document.getElementById("postList")) {

    fetch(`https://api.github.com/repos/${username}/${repo}/contents/${baseFolder}`)
        .then(response => response.json())
        .then(data => {

            const postList = document.getElementById("postList");

            data.forEach(item => {

                // Check if it is a folder (category)
                if (item.type === "dir") {

                    const categoryDiv = document.createElement("div");
                    categoryDiv.innerHTML = `<h2>${item.name.toUpperCase()}</h2>`;
                    postList.appendChild(categoryDiv);

                    // Fetch files inside category
                    fetch(item.url)
                        .then(res => res.json())
                        .then(files => {

                            const ul = document.createElement("ul");

                            files.forEach(file => {
                                if (file.name.endsWith(".md")) {

                                    const title = file.name
                                        .replace(".md", "")
                                        .replace(/-/g, " ");

                                    const li = document.createElement("li");
                                    li.innerHTML = `
                                        <a href="post.html?category=${item.name}&file=${file.name}">
                                            ${title}
                                        </a>
                                    `;
                                    ul.appendChild(li);
                                }
                            });

                            postList.appendChild(ul);
                        });
                }
            });
        });
}


// ===============================
// POST PAGE - Render Markdown
// ===============================
if (document.getElementById("content")) {

    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    const file = params.get("file");

    if (category && file) {
        fetch(`posts/${category}/${file}`)
            .then(response => response.text())
            .then(text => {
                document.getElementById("content").innerHTML = marked.parse(text);
            });
    }
}