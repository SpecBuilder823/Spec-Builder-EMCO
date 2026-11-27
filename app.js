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

function showAddProduct() {

    document
        .getElementById(
            "manualProductCard"
        )
        .classList
        .remove("hidden");

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
        model,
        manual: true

    });

    document.getElementById(
        "manualBrand"
    ).value = "";

    document.getElementById(
        "manualModel"
    ).value = "";

    renderProducts();

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

    const pdf =
        await pdfjsLib.getDocument({

            data:
                await file.arrayBuffer()

        }).promise;

    let allItems = [];

    for (
        let page = 1;
        page <= pdf.numPages;
        page++
    ) {

        const currentPage =
            await pdf.getPage(page);

        const textContent =
            await currentPage.getTextContent();

        allItems =

            allItems.concat(
                textContent.items
            );

    }

    detectSectionsFromCoordinates(
        allItems
    );

}

function detectSectionsFromCoordinates(
    items
) {

    const rows = [];

    items.forEach(item => {

        rows.push({

            text:
                (item.str || "")
                    .trim(),

            x:
                item.transform[4],

            y:
                Math.round(
                    item.transform[5]
                ),

            height:
                item.height || 0

        });

    });

    const groupedRows = [];

    rows.forEach(row => {

        let existing =

            groupedRows.find(

                r => Math.abs(
                    r.y - row.y
                ) < 3

            );

        if (existing) {

            existing.text +=
                " " +
                row.text;

        }
        else {

            groupedRows.push({

                y:
                    row.y,

                text:
                    row.text

            });

        }

    });

    groupedRows.sort(

        (a, b) =>
            b.y - a.y

    );

    detectedSections = [];

    for (
        let i = 1;
        i < groupedRows.length - 1;
        i++
    ) {

        const current =
            groupedRows[i];

        const previous =
            groupedRows[i - 1];

        const next =
            groupedRows[i + 1];

        const gapAbove =

            Math.abs(
                previous.y -
                current.y
            );

        const gapBelow =

            Math.abs(
                current.y -
                next.y
            );

        const looksLikeHeader =

            gapAbove > 18 &&
            gapBelow > 18;

        if (
            looksLikeHeader
        ) {

            detectedSections.push({

                title:
                    current.text,

                products: []

            });

        }

    }

    renderSections();

    alert(

        detectedSections.length +
        " sections detected"

    );

}

renderProducts();
