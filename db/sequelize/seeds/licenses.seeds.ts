import { License } from '../models';

export const licensesSeed = {
    name: 'Licenses',
    async run() {
        await License.bulkCreate([
            { name: 'CC BY', description: 'Creative Commons Attribution', url: 'https://creativecommons.org/licenses/by/4.0/', allows_commercial_use: true, allows_modification: true, requires_attribution: true },
            { name: 'CC BY-SA', description: 'Creative Commons Attribution-ShareAlike', url: 'https://creativecommons.org/licenses/by-sa/4.0/', allows_commercial_use: true, allows_modification: true, requires_attribution: true },
            { name: 'CC BY-NC', description: 'Creative Commons Attribution-NonCommercial', url: 'https://creativecommons.org/licenses/by-nc/4.0/', allows_commercial_use: false, allows_modification: true, requires_attribution: true },
            { name: 'CC0', description: 'Creative Commons Zero', url: 'https://creativecommons.org/publicdomain/zero/1.0/', allows_commercial_use: true, allows_modification: true, requires_attribution: false },
            { name: 'GPL', description: 'GNU General Public License', url: 'https://www.gnu.org/licenses/gpl-3.0.html', allows_commercial_use: true, allows_modification: true, requires_attribution: true },
        ], { ignoreDuplicates: true });
    }
};