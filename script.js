const username = "Santhuvaddelli";
const repo = "MarkdownSite";
const baseFolder = "posts";

// ===============================
// INDEX PAGE - Load Categories
// ===============================
if (document.getElementById("postList")) {

    fetch(`https://api.github.com/repos/${username}/${repo}/contents/${baseFolder}`)
        .then(res => res.json())
        .then(data => {

            const postList = document.getElementById("postList");

            data.forEach(folder => {

                if (folder.type === "dir") {

                    // Create category section
                    const categorySection = document.createElement("div");
                    categorySection.style.marginBottom = "40px";

                    const categoryTitle = document.createElement("h2");
                    categoryTitle.textContent = folder.name.toUpperCase();
                    categorySection.appendChild(categoryTitle);

                    const ul = document.createElement("ul");

                    // Fetch files inside this folder
                    fetch(folder.url)
                        .then(res => res.json())
                        .then(files => {

                            files.forEach(file => {

                                if (file.name.endsWith(".md")) {

                                    const title = file.name
                                        .replace(".md", "")
                                        .replace(/-/g, " ");

                                    const li = document.createElement("li");

                                    li.innerHTML = `
                                        <a href="post.html?category=${folder.name}&file=${file.name}">
                                            ${title}
                                        </a>
                                    `;

                                    ul.appendChild(li);
                                }
                            });

                        });

                    categorySection.appendChild(ul);
                    postList.appendChild(categorySection);
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
            .then(res => res.text())
            .then(text => {
                document.getElementById("content").innerHTML = marked.parse(text);
            });
    }
}