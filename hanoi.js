
import { SVG } from 'https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js/+esm';
function hanoi(n, display_move) {
    hanoi_rec(n, 0, 2);
    function hanoi_rec(n, from, to) {
        if (n == 1) {
            display_move(from, to);
            return;
        }
        const aux = 3 - from - to;
        hanoi_rec(n - 1, from, aux);
        display_move(from, to);
        hanoi_rec(n - 1, aux, to);
    }
}
function console_display_move(from, to) {
    console.log(from, "--->", to);
}

document.getElementById("start_hanoi").onclick = start_hanoi;
const draw = SVG().addTo('#drawing')
function start_hanoi() {

    const n = document.getElementById('ring_count').value;


    draw.clear()
    const towerLength = 100;
    const towerWidth = 10;
    const x_positions = []
    const number_of_topers = 3;
    //positions setup
    for (let i = 0; i < number_of_topers; i++) {
        x_positions.push(80 * (1 + i))
    }

    function tower_x(tower_index) {
        return x_positions[tower_index] - towerWidth / 2;
    }
    //tower setup
    const highest_point_tower = 60;
    for (let i = 0; i < number_of_topers; i++) {
        const tower1 = draw.rect(towerWidth, towerLength).fill('#f06')
        tower1.attr({ x: tower_x(i), y: highest_point_tower })
    }
    // other setup
    const lowest_point_y = highest_point_tower + towerLength
    const distance_between_rings = 10;
    const ring_height = 5;
    const rings = [];
    const tower_rings = [Array.from({ length: n }, (e, i) => i), [], []];
    const max_ring_width = 50
    const min_ring_width = towerWidth + 10;
    const highest_ring_move_position = highest_point_tower - 20;



    //ring setup
    for (let i = 0; i < n; i++) {
        const ring_width = max_ring_width - (max_ring_width - min_ring_width) / n * i;
        rings.push(draw.rect(ring_width, ring_height).fill('#f000006').attr({ x: ring_x(0, ring_width), y: ring_y(i) }));
    }

    function ring_y(position_on_tower) {
        return lowest_point_y - distance_between_rings / 2 - (distance_between_rings + ring_height) * position_on_tower
    }

    function ring_x(tower_index, ring_width = 20) {
        return x_positions[tower_index] - ring_width / 2;
    }
    function count_rings_on_tower(tower_index) {
        return tower_rings[tower_index].length;
    }
    let timer_index = 0;

    async function move_ring(from, to) {
        await new Promise(resolve => setTimeout(resolve, 1800 * (timer_index++)));
        const ring_nr = tower_rings[from].pop();
        const ring = rings[ring_nr];
        ring.animate(500).attr({ x: ring_x(from, ring.width()), y: highest_ring_move_position });
        ring.animate(500).attr({ x: ring_x(to, ring.width()), y: highest_ring_move_position });
        ring.animate(500).attr({ x: ring_x(to, ring.width()), y: ring_y(count_rings_on_tower(to)) });
        tower_rings[to].push(ring_nr);
    }
    console.log("Starting hanoi with", n, "rings");
    hanoi(n, console_display_move);
    hanoi(n, move_ring);

}