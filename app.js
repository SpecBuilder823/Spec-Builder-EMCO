let detectedSections = [];

let products = [];

function addSection() {

    const name =
        document.getElementById(
            "sectionName"
        ).value.trim();

    if (!name) return;

    detectedSections.push({
        title: name,
        products: []
    });

    document.getElementById(
        "sectionName"
    ).value = "";

    renderSections();

}

function addProduct() {

    const section =
        document.getElementById(
            "manualSection"
        ).value;

    const brand =
        document.getElementById(
            "manualBrand"
        ).value.trim();

    const model =
        document.getElementById(
            "manualModel"
        ).value.trim();

    if (!section) return;

    if (!brand) return;

    if (!model) return;

    products.push({

        section,
        brand,
        model

    });

    document.getElementById(
        "manualBrand"
    ).value = "";

    document.getElementById(
        "manualModel"
    ).value = "";

    renderProducts();

}

function showAddProduct() {

    document
        .getElementById(
            "manualProductCard"
        )
        .classList
        .remove("hidden");

}

function renderSections() {

    const container =
        document.getElementById(
            "sectionList"
        );

    const select =
        document.getElementById(
            "manualSection"
        );

    container.innerHTML = "";

    select.innerHTML = "";

    detectedSections.forEach(section => {

        container.innerHTML += `

        <div class="room">

            ✅ ${section.title}

        </div>

        `;

        select.innerHTML += `

        <option>

            ${section.title}

        </option>

        `;

    });

}

function renderProducts() {

    const container =
        document.getElementById(
            "productsContainer"
        );

    if (products.length === 0) {

        container.innerHTML = `
        
        <div class="empty-state">

            No products loaded yet

        </div>

        `;

        return;

    }

    let html = "";

    products.forEach(product => {

        html += `

        <div class="product-card">

            <div class="product-title">

                ${product.section}

            </div>

            <div class="product-item">

                Brand:
                ${product.brand}

            </div>

            <div class="product-item">

                Model:
                ${product.model}

            </div>

        </div>

        `;

    });

    container.innerHTML = html;

}

async function readQuote() {

    const file =
        document.getElementById(
            "pdfFile"
        ).files[0];

    if (!file) {

        alert(
            "Please select a PDF quote."
        );

        return;

    }

    const arrayBuffer =
        await file.arrayBuffer();

    const pdf =
        await pdfjsLib.getDocument({

            data: arrayBuffer

        }).promise;

    let extractedText = "";

    for (
        let page = 1;
        page <= pdf.numPages;
        page++
    ) {

        const currentPage =
            await pdf.getPage(page);

        const textContent =
            await currentPage.getTextContent();

        const pageText =
            textContent.items
                .map(item => item.str)
                .join(" ");

        extractedText +=
            pageText + "\n";

    }

    console.log(
        extractedText
    );

    detectSectionCandidates(
        extractedText
    );

}

function detectSectionCandidates(
    text
) {

    detectedSections = [];

    const lines =
        text
        .split(/\n|\r/)
        .map(x => x.trim())
        .filter(x => x.length > 0);

    const candidates = [];

    lines.forEach(line => {

        const looksLikePrice =
            /\$\d/.test(line);

        const looksLikeModel =
            /^[A-Z0-9\-]+$/.test(line);

        if (
            !looksLikePrice &&
            !looksLikeModel &&
            line.length > 5
        ) {

            candidates.push(line);

        }

    });

    const unique =
        [...new Set(candidates)]
        .slice(0, 20);

    unique.forEach(line => {

        detectedSections.push({

            title: line,
            products: []

        });

    });

    renderSections();

    alert(

        detectedSections.length +
        " section candidates found"

    );

}

renderProducts();
