
let detectedSections = [];
let products = [];

/* -------------------------- */
/* MANUAL SECTION             */
/* -------------------------- */

function showAddSection(){

    document
        .getElementById(
            "addSectionCard"
        )
        .classList
        .remove("hidden");

}

function addSection(){

    const name =

        document
        .getElementById(
            "sectionName"
        )
        .value
        .trim();

    if(!name) return;

    detectedSections.push({

        title:name

    });

    renderSections();

    document
        .getElementById(
            "sectionName"
        )
        .value="";

}

/* -------------------------- */
/* MANUAL PRODUCT             */
/* -------------------------- */

function showAddProduct(){

    document
        .getElementById(
            "manualProductCard"
        )
        .classList
        .remove("hidden");

}

function addProduct(){

    const section =

        document
        .getElementById(
            "manualSection"
        )
        .value;

    const brand =

        document
        .getElementById(
            "manualBrand"
        )
        .value
        .trim();

    const model =

        document
        .getElementById(
            "manualModel"
        )
        .value
        .trim();

    if(!section) return;
    if(!brand) return;
    if(!model) return;

    products.push({

        section,
        brand,
        model

    });

    renderProducts();

}

/* -------------------------- */
/* PDF IMPORT                 */
/* -------------------------- */

async function readQuote(){

    try{

        const file =

            document
            .getElementById(
                "pdfFile"
            )
            .files[0];

        if(!file){

            alert(
                "Select a PDF first."
            );

            return;

        }

        const pdf =

            await pdfjsLib
            .getDocument({

                data:
                await file.arrayBuffer()

            })
            .promise;

        let rows = [];

        for(

            let pageNumber = 1;

            pageNumber <= pdf.numPages;

            pageNumber++

        ){

            const page =

                await pdf
                .getPage(
                    pageNumber
                );

            const content =

                await page
                .getTextContent();

            content.items.forEach(item=>{

                rows.push({

                    text:
                    (item.str || "")
                    .trim(),

                    x:
                    item.transform[4],

                    y:
                    Math.round(
                        item.transform[5]
                    )

                });

            });

        }

        buildSections(
            rows
        );

    }

    catch(error){

        console.error(
            error
        );

        alert(
            "Error reading PDF"
        );

    }

}

/* -------------------------- */
/* SECTION DETECTION          */
/* -------------------------- */

function buildSections(rows){

    detectedSections = [];

    const groupedRows = [];

    rows.forEach(row=>{

        if(!row.text)
            return;

        let existing =

            groupedRows.find(

                r =>

                Math.abs(
                    r.y-row.y
                ) < 3

            );

        if(existing){

            existing.text +=

                " " +
                row.text;

        }

        else{

            groupedRows.push({

                y:
                row.y,

                text:
                row.text

            });

        }

    });

    groupedRows.sort(

        (a,b) =>

        b.y-a.y

    );

    for(

        let i = 1;

        i < groupedRows.length - 1;

        i++

    ){

        const current =
            groupedRows[i];

        const previous =
     
