// Data storage
        let links = {
            study: [
                { name: "Hexlet", url: "https://hexlet.io" },
                { name: "RS School", url: "https://rs.school" },
                { name: "MDN Web Docs", url: "https://developer.mozilla.org" }
            ],
            work: [
                { name: "GitHub", url: "https://github.com" },
                { name: "VS Code", url: "https://code.visualstudio.com" },
                { name: "Stack Overflow", url: "https://stackoverflow.com" }
            ],
            entertainment: [
                { name: "YouTube", url: "https://youtube.com" },
                { name: "Steam", url: "https://store.steampowered.com" },
                { name: "Reddit", url: "https://reddit.com" }
            ]
        };

        let currentGroup = '';
        let editingIndex = -1;

        // Load data from localStorage
        function loadData() {
            const savedLinks = localStorage.getItem('homepage-links');
            if (savedLinks) {
                links = JSON.parse(savedLinks);
            }
        }

        // Save data to localStorage
        function saveData() {
            localStorage.setItem('homepage-links', JSON.stringify(links));
        }

        // Initialize the page
        function init() {
            loadData();
            renderAllLinks();
            updateTime();
            setInterval(updateTime, 1000);

            // Setup search
            document.getElementById('searchInput').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
        }

        // Render links for all groups
        function renderAllLinks() {
            Object.keys(links).forEach(group => {
                renderLinks(group);
            });
        }

        // Render links for a specific group
        function renderLinks(group) {
            const container = document.getElementById(`${group}-links`);
            container.innerHTML = '';

            links[group].forEach((link, index) => {
                const li = document.createElement('li');
                li.className = 'link-item';
                li.innerHTML = `
                    <a href="${link.url}" target="_blank">${link.name}</a>
                    <div class="link-actions">
                        <button class="edit-btn" onclick="editLink('${group}', ${index})">✏️</button>
                        <button class="delete-btn" onclick="deleteLink('${group}', ${index})">🗑️</button>
                    </div>
                `;
                container.appendChild(li);
            });
        }

        // Open add modal
        function openAddModal(group) {
            currentGroup = group;
            editingIndex = -1;
            document.getElementById('modalTitle').textContent = 'Добавить ссылку';
            document.getElementById('linkName').value = '';
            document.getElementById('linkUrl').value = '';
            document.getElementById('linkModal').style.display = 'block';
        }

        // Edit link
        function editLink(group, index) {
            currentGroup = group;
            editingIndex = index;
            const link = links[group][index];
            document.getElementById('modalTitle').textContent = 'Редактировать ссылку';
            document.getElementById('linkName').value = link.name;
            document.getElementById('linkUrl').value = link.url;
            document.getElementById('linkModal').style.display = 'block';
        }

        // Delete link
        function deleteLink(group, index) {
            if (confirm('Удалить эту ссылку?')) {
                links[group].splice(index, 1);
                renderLinks(group);
                saveData();
            }
        }

        // Save link
        function saveLink() {
            const name = document.getElementById('linkName').value.trim();
            const url = document.getElementById('linkUrl').value.trim();

            if (!name || !url) {
                alert('Заполните все поля');
                return;
            }

            const linkData = { name, url };

            if (editingIndex >= 0) {
                links[currentGroup][editingIndex] = linkData;
            } else {
                links[currentGroup].push(linkData);
            }

            renderLinks(currentGroup);
            saveData();
            closeModal();
        }

        // Close modal
        function closeModal() {
            document.getElementById('linkModal').style.display = 'none';
        }

        // Search function
        function performSearch() {
            const query = document.getElementById('searchInput').value.trim();
            if (query) {
                window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
            }
        }

        // Update time
        function updateTime() {
            const now = new Date();
            const timeString = now.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit'
            });
            document.getElementById('currentTime').textContent = timeString;
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('linkModal');
            if (event.target === modal) {
                closeModal();
            }
        }

        // Initialize on load
        window.onload = init;