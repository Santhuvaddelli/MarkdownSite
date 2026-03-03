const username = "Santhuvaddelli";
const repo = "MarkdownSite";
const baseFolder = "posts";

if (document.getElementById("postList")) {

    fetch(`https://api.github.com/repos/${username}/${repo}/contents/${baseFolder}`)
        .then(res => res.json())
        .then(async items => {

            const postList = document.getElementById("postList");

            // // For standalone files
            // const generalSection = document.createElement("div");
            // const generalTitle = document.createElement("h2");
            // generalTitle.textContent = "GENERAL";
            // const generalList = document.createElement("ul");

            let hasGeneral = false;

            for (const item of items) {

                // -----------------------
                // If it's a FOLDER
                // -----------------------
                if (item.type === "dir") {

                    const categorySection = document.createElement("div");
                    categorySection.style.marginBottom = "40px";

                    const categoryTitle = document.createElement("h2");
                    categoryTitle.textContent = item.name.toUpperCase();
                    categorySection.appendChild(categoryTitle);

                    const ul = document.createElement("ul");

                    const response = await fetch(item.url);
                    const files = await response.json();

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

                    categorySection.appendChild(ul);
                    postList.appendChild(categorySection);
                }

                // -----------------------
                // If it's a DIRECT .md file
                // -----------------------
                if (item.type === "file" && item.name.endsWith(".md")) {

                    hasGeneral = true;

                    const title = item.name
                        .replace(".md", "")
                        .replace(/-/g, " ");

                    const li = document.createElement("li");

                    li.innerHTML = `
                        <a href="post.html?file=${item.name}">
                            ${title}
                        </a>
                    `;

                    generalList.appendChild(li);
                }
            }

            if (hasGeneral) {
                generalSection.appendChild(generalTitle);
                generalSection.appendChild(generalList);
                postList.appendChild(generalSection);
            }

        });
}


// ===============================
// POST PAGE
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
    else if (file) {
        fetch(`posts/${file}`)
            .then(res => res.text())
            .then(text => {
                document.getElementById("content").innerHTML = marked.parse(text);
            });
    }
}