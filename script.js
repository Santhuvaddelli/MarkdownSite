const username = "Santhuvaddelli";
const repo = "MarkdownSite";
const baseFolder = "posts";

// ===============================
// SMART FETCH WITH CACHE
// ===============================
async function fetchWithCache(url, expiryMinutes = 10) {

    const cached = localStorage.getItem(url);

    if (cached) {
        const parsed = JSON.parse(cached);

        const now = Date.now();
        const cacheTime = parsed.timestamp;

        // Check expiry time
        if (now - cacheTime < expiryMinutes * 60 * 1000) {
            console.log("Returning from cache:", url);
            return parsed.data;
        }
    }

    console.log("Fetching from API:", url);

    const response = await fetch(url);
    const data = await response.json();

    localStorage.setItem(url, JSON.stringify({
        timestamp: Date.now(),
        data: data
    }));

    return data;
}

// ===============================
// INDEX PAGE
// ===============================
if (document.getElementById("postList")) {

    (async () => {

        const apiURL = `https://api.github.com/repos/${username}/${repo}/contents/${baseFolder}`;

        const items = await fetchWithCache(apiURL);

        const postList = document.getElementById("postList");

        for (const item of items) {

            // -----------------------
            // DIRECT .md file
            // -----------------------
            if (item.type === "file" && item.name.endsWith(".md")) {

                const title = item.name
                    .replace(".md", "")
                    .replace(/-/g, " ");

                const li = document.createElement("li");

                li.innerHTML = `
                    <a href="post.html?file=${item.name}">
                        ${title}
                    </a>
                `;

                postList.appendChild(li);
            }

            // -----------------------
            // CATEGORY FOLDER
            // -----------------------
            if (item.type === "dir") {

                const categorySection = document.createElement("div");
                categorySection.style.marginTop = "40px";

                const categoryTitle = document.createElement("h2");
                categoryTitle.textContent = item.name.toUpperCase();
                categorySection.appendChild(categoryTitle);

                const ul = document.createElement("ul");

                const files = await fetchWithCache(item.url);

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
        }

    })();
}

// ===============================
// POST PAGE
// ===============================
if (document.getElementById("content")) {

    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    const file = params.get("file");

    const contentURL = category
        ? `posts/${category}/${file}`
        : `posts/${file}`;

    fetchWithCache(contentURL, 30) // cache article for 30 minutes
        .then(text => {
            if (typeof text === "string") {
                document.getElementById("content").innerHTML = marked.parse(text);
            } else {
                // If cached API response accidentally stored JSON
                fetch(contentURL)
                    .then(res => res.text())
                    .then(realText => {
                        document.getElementById("content").innerHTML = marked.parse(realText);
                    });
            }
        });
}