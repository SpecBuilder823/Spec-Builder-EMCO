function showAddSection(){

    document
        .getElementById(
            "addSectionCard"
        )
        .classList
        .remove("hidden");

}

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
    alert(
"reader started"
);

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
alert(
"pdf loaded"
);
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
                alert(
"items found: " +
textContent.items.length
);
            );
        console.log(
textContent.items
);


    }

    detectSectionsFromCoordinates(
        allItems
    );

}

function detectSectionsFromCoordinates(items){

    alert("NEW ALGORITHM RUNNING");
    const rows = [];

    items.forEach(item=>{

        const text =
        (item.str || "").trim();

        if(text==="") return;

        rows.push({

            text,

            x: item.transform[4],

            y: Math.round(
                item.transform[5]
            )

        });

    });

    const groupedRows = [];

    rows.forEach(row=>{

        let existing =

        groupedRows.find(

            r => Math.abs(
                r.y-row.y
            ) < 3

        );

        if(existing){

            existing.cells.push(row);

        }else{

            groupedRows.push({

                y: row.y,

                cells:[row]

            });

        }

    });

    groupedRows.sort(
        (a,b)=>b.y-a.y
    );

    detectedSections = [];

    groupedRows.forEach(row=>{

        row.cells.sort(
            (a,b)=>a.x-b.x
        );

        const firstCell =
        row.cells[0];

        const secondCell =
        row.cells[1];

        const thirdCell =
        row.cells[2];

        const fourthCell =
        row.cells[3];

        const fifthCell =
        row.cells[4];

        /*
        SECTION RULE

        Column 1 empty
        Column 2 contains text
        Qty empty
        Prices empty

        Example:

        MASTER BATH 60X30

        visible in description column only
        */

        const modelColumnEmpty =

        !firstCell ||
        firstCell.text==="";

        const descriptionColumnHasText =

        secondCell &&
        secondCell.text.length > 0;

        const qtyEmpty =

        !thirdCell;

        const priceEmpty =

        !fourthCell;

        const subtotalEmpty =

        !fifthCell;

        const looksLikeSection =

        descriptionColumnHasText &&
        qtyEmpty &&
        priceEmpty &&
        subtotalEmpty;

        if(looksLikeSection){

            const title =
            secondCell.text.trim();

            if(

                title.length > 2 &&

                !title.includes("$") &&

                !title.includes("CUSTOMER") &&

                !title.includes("DATE")

            ){

                detectedSections.push({

                    title,
                    products:[]

                });

            }

        }

    });

    detectedSections =

    detectedSections.filter(

        (section,index,self)=>

        index===self.findIndex(
            s=>s.title===section.title
        )

    );

    renderSections();

    alert(

        detectedSections.length +
        " sections detected"

    );

}

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
