import { Template } from 'meteor/templating';
import d3 from 'd3';
// import {html} from 'd3-rs-table';
import { html as table } from './table'

import './main.html';

Template.table.onRendered(() => {
    let size = 50,
        runs = 100;

    let el = d3.select('#tbl'),
        tbl = table(true).text((d) => d ? d.toFixed(2) : null);

    time(el, tbl, size, runs, false)
        .then(results.bind(results, d3.select('#regular'), 'regular'))
        .then(() => time(el, tbl, size, runs, true))
        .then(results.bind(results, d3.select('#ragged'), 'ragged'));
});

function makeRandom(rowso, colso, rng) {
    let rows = rowso;
    if (rng === true) {
        rows = Math.round(Math.random() * rowso);
    }
    let r = new Array(rows);

    let i = 0,
        cells = 0;
    while (i < rows) {
        let cols = colso;
        if (rng === true) {
            cols = Math.round(Math.random() * colso);
        }
        let c = new Array(cols);

        let ii = 0;
        while (ii < cols) {
            c[ii] = Math.random();
            cells++;
            ii++;
        }

        r[i] = c;
        i++;
    }

    return {
        c: cells,
        a: r
    };
}

let average = (data) => data.reduce((sum, value) => sum + value, 0) / data.length;

function stats(values) {
    let avg = average(values);
    let squareDiffs = values.map((value) => {
        let diff = value - avg;
        return diff * diff;
    });

    return {
        avg: avg,
        std: Math.sqrt(average(squareDiffs))
    };
}

function results(ui, filename, array) {
    let stat = stats(array.slice(1, array.length).map((d) => d[1]));
    ui.select('.avg').text(stat.avg.toFixed(3));
    ui.select('.std').text(stat.std.toFixed(3));

    let link = ui.select('.csv').selectAll('a').data([array]);
    link.enter().append('a');
    link.attr('download', filename + '-' + Date.now()).attr('href', resultToObject).text('Download');
}

function resultToObject(array) {
    let url = window.URL || window.webkitURL;
    let csv = array.map((r) => r.join(',')).join('\n');
    return url.createObjectURL(new Blob([csv], {
        type: 'text/csv'
    }));
}

function time(el, tbl, sz, runs, rng) {
    return new Promise((ok, ko) => {
        let results = new Array(runs + 1);
        results[0] = ['# run', 'ms', 'rows cfg=' + (sz * sz)];
        let i = 0;
        let t = d3.timer(() => {
            let test = makeRandom(sz, sz, rng);
            let _start = performance.now();
            // timed function
            el.datum(test.a).call(tbl);
            let _end = performance.now() - _start;
            i++;
            results[i] = [i, _end, test.c];

            let done = (i > runs);
            if (done) {
                ok(results);
                t.stop();
            }
        });
    });
}
